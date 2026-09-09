var BlastRadiusEvaluator = Class.create();
BlastRadiusEvaluator.prototype = {

    /**
     * IN-clause chunk size for querying grant_inventory across a
     * group's members. Keeps the encoded query string bounded for
     * very large groups instead of one unbounded IN list.
     */
    MEMBER_CHUNK_SIZE: 1000,

    initialize: function () {
        this.grantTable = 'x_1906124_pantheon_grant_inventory';
        this.membershipTable = 'sys_user_grmember';
        this.containsTable = 'sys_user_role_contains';
        this.registerTable = 'x_1906124_pantheon_sensitive_table_register';
        this.aclRoleTable = 'sys_security_acl_role';
        this.impersonatorRoleName = 'impersonator';
        this.adminRoleName = 'admin';

        this._containsMap = null; // role sys_id -> [contained role sys_ids], cached per instance
    },

    /**
     * Pure traversal. Returns:
     *   {
     *     entityType, entitySysId,
     *     reachableRoles: [{ role, roleName, hopCount }, ...],
     *     sensitiveTablesReached: [{ table, sensitivity, hopCount }, ...],
     *     sensitiveTableCount: number,
     *     hopCount: number,               // deepest hop among reached sensitive tables, 0 if none
     *     hasImpersonationEntitlement: boolean,
     *     memberCount: number|null        // group entityType only
     *   }
     *
     * Writes nothing.
     */
    calculateBlastRadius: function (entityType, entitySysId) {
        var memberCount = null;
        var grantedRoleIds;

        if (entityType === 'group') {
            var members = this._groupMembers(entitySysId);
            memberCount = members.length;
            grantedRoleIds = this._grantedRolesForUsers(members);
        } else {
            grantedRoleIds = this._grantedRolesForUsers([entitySysId]);
        }

        var reachable = this._expandRoles(grantedRoleIds); // roleId -> hopCount
        var roleIds = Object.keys(reachable);
        var roleNames = this._loadRoleNames(roleIds); // roleId -> name, one query

        var sensitiveTablesReached = this._sensitiveTablesReached(reachable, roleIds, roleNames);

        var hopCount = 0;
        for (var i = 0; i < sensitiveTablesReached.length; i++) {
            if (sensitiveTablesReached[i].hopCount > hopCount) {
                hopCount = sensitiveTablesReached[i].hopCount;
            }
        }

        return {
            entityType: entityType,
            entitySysId: entitySysId,
            reachableRoles: this._describeRoles(reachable, roleNames),
            sensitiveTablesReached: sensitiveTablesReached,
            sensitiveTableCount: sensitiveTablesReached.length,
            hopCount: hopCount,
            hasImpersonationEntitlement: this._roleIdNamed(roleNames, this.impersonatorRoleName) !== null,
            memberCount: memberCount
        };
    },

    /**
     * Pure function over calculateBlastRadius's output. Weights are
     * tunable via blast.hop_weight / blast.sensitive_table_weight /
     * blast.impersonation_weight. Capped at 100.
     */
    calculateBlastRadiusScore: function (traversalResult) {
        var hopWeight = parseFloat(gs.getProperty('x_1906124_pantheon.blast.hop_weight', '8'));
        var sensitiveTableWeight = parseFloat(gs.getProperty('x_1906124_pantheon.blast.sensitive_table_weight', '6'));
        var impersonationWeight = parseFloat(gs.getProperty('x_1906124_pantheon.blast.impersonation_weight', '15'));

        var raw = (traversalResult.hopCount * hopWeight) +
                  (traversalResult.sensitiveTableCount * sensitiveTableWeight) +
                  (traversalResult.hasImpersonationEntitlement ? impersonationWeight : 0);

        return Math.min(100, Math.round(raw * 10) / 10);
    },

    // Direct members of the group. Deliberately NOT sub-group members --
    // a member of a nested child group is reached through grant_inventory's
    // own group-ancestor-chain expansion (GrantInventoryBuilder), not
    // through group-of-groups membership here.
    _groupMembers: function (groupSysId) {
        var members = [];
        var gr = new GlideRecord(this.membershipTable);
        gr.addQuery('group', groupSysId);
        gr.query();
        while (gr.next()) {
            members.push(gr.getValue('user'));
        }
        return members;
    },

    // One query per chunk against grant_inventory (not one query per
    // member) -- the N+1 risk for a large group is here, and this is
    // the mitigation. Returns unique role sys_ids at hop 0.
    _grantedRolesForUsers: function (userSysIds) {
        var seen = {};
        var roles = [];

        for (var offset = 0; offset < userSysIds.length; offset += this.MEMBER_CHUNK_SIZE) {
            var chunk = userSysIds.slice(offset, offset + this.MEMBER_CHUNK_SIZE);

            var gr = new GlideRecord(this.grantTable);
            gr.addQuery('user', 'IN', chunk.join(','));
            gr.query();
            while (gr.next()) {
                var roleId = gr.getValue('role');
                if (roleId && !seen[roleId]) {
                    seen[roleId] = true;
                    roles.push(roleId);
                }
            }
        }
        return roles;
    },

    // BFS over sys_user_role_contains from the granted roles. Returns
    // { roleId: hopCount }, hopCount 0 for directly granted roles.
    _expandRoles: function (rootRoleIds) {
        this._loadContainsMap();

        var hopOf = {};
        var queue = [];
        for (var i = 0; i < rootRoleIds.length; i++) {
            if (!(rootRoleIds[i] in hopOf)) {
                hopOf[rootRoleIds[i]] = 0;
                queue.push(rootRoleIds[i]);
            }
        }

        var head = 0;
        while (head < queue.length) {
            var role = queue[head++];
            var hop = hopOf[role];
            var children = this._containsMap[role] || [];
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                if (!(child in hopOf)) {
                    hopOf[child] = hop + 1;
                    queue.push(child);
                }
            }
        }
        return hopOf;
    },

    // Loaded once per evaluator instance -- 925 rows on this instance
    // (verified via now-sdk query), trivial to hold in memory for a
    // single traversal run. Table/column names verified against
    // System Definition > Tables before this class was written; see
    // GrantInventoryBuilder for the earlier, uncaught mistake
    // (queried 'sys_role_contains', which does not exist -- the real
    // table is 'sys_user_role_contains').
    _loadContainsMap: function () {
        if (this._containsMap) {
            return;
        }
        this._containsMap = {};

        var gr = new GlideRecord(this.containsTable);
        gr.query();
        while (gr.next()) {
            var parent = gr.getValue('role');
            var child = gr.getValue('contains');
            if (!parent || !child) {
                continue;
            }
            if (!this._containsMap[parent]) {
                this._containsMap[parent] = [];
            }
            this._containsMap[parent].push(child);
        }
    },

    // Cross-references the reachable role set against
    // sensitive_table_register. Looks up the read ACLs for the
    // registered tables FIRST (table name is a native field on
    // sys_security_acl, so a direct query is reliable), then checks
    // which of those ACLs have a role-grant row for a reachable role
    // -- rather than starting from sys_security_acl_role and
    // dot-walking to sys_security_acl.name, which does not work:
    // 'name' on sys_security_acl is a composite_name field, and
    // GlideRecord.getValue() on a dot-walked composite_name path
    // returns empty even though the same path filters correctly in
    // addQuery (verified with a throwaway diagnostic Fix Script
    // against this instance before writing this version).
    //
    // SPECIAL CASE: the platform admin role bypasses table-level ACL
    // evaluation at runtime, so a reachable admin role would
    // otherwise under-count -- explicit sys_security_acl_role rows
    // for 'admin' are the exception on most tables, not the rule.
    // When 'admin' is reachable, every registered table counts as
    // reached at admin's own hop count.
    _sensitiveTablesReached: function (hopOf, roleIds, roleNames) {
        var register = this._loadRegister();
        var minHopForTable = {};

        var adminRoleId = this._roleIdNamed(roleNames, this.adminRoleName);
        if (adminRoleId !== null) {
            var adminHop = hopOf[adminRoleId];
            for (var tableName in register) {
                if (register.hasOwnProperty(tableName)) {
                    minHopForTable[tableName] = adminHop;
                }
            }
        }

        if (roleIds.length > 0) {
            var aclToTable = this._loadReadAclsForTables(Object.keys(register)); // acl sys_id -> table name
            var aclIds = Object.keys(aclToTable);

            if (aclIds.length > 0) {
                var gr = new GlideRecord(this.aclRoleTable);
                gr.addQuery('sys_user_role', 'IN', roleIds.join(','));
                gr.addQuery('sys_security_acl', 'IN', aclIds.join(','));
                gr.query();

                while (gr.next()) {
                    var tableName2 = aclToTable[gr.getValue('sys_security_acl')];
                    var roleId = gr.getValue('sys_user_role');
                    var hop = hopOf[roleId];
                    if (!(tableName2 in minHopForTable) || hop < minHopForTable[tableName2]) {
                        minHopForTable[tableName2] = hop;
                    }
                }
            }
        }

        var results = [];
        for (var t in minHopForTable) {
            if (minHopForTable.hasOwnProperty(t)) {
                results.push({
                    table: t,
                    sensitivity: register[t],
                    hopCount: minHopForTable[t]
                });
            }
        }
        return results;
    },

    // Active, record-type, read ACLs for exactly the registered
    // tables. Small and cheap regardless of instance size -- bounded
    // by the size of sensitive_table_register, not the platform's
    // total ACL count.
    _loadReadAclsForTables: function (tableNames) {
        var map = {};
        if (tableNames.length === 0) {
            return map;
        }
        var gr = new GlideRecord('sys_security_acl');
        gr.addQuery('name', 'IN', tableNames.join(','));
        gr.addQuery('type', 'record');
        gr.addQuery('operation', 'read');
        gr.addQuery('active', true);
        gr.query();
        while (gr.next()) {
            map[gr.getUniqueValue()] = gr.getValue('name');
        }
        return map;
    },

    _loadRegister: function () {
        var register = {};
        var gr = new GlideRecord(this.registerTable);
        gr.query();
        while (gr.next()) {
            register[gr.getValue('table_name')] = gr.getValue('sensitivity');
        }
        return register;
    },

    // One IN-query for every reachable role's name, instead of a
    // GlideRecord.get() per role.
    _loadRoleNames: function (roleIds) {
        var names = {};
        if (roleIds.length === 0) {
            return names;
        }
        var gr = new GlideRecord('sys_user_role');
        gr.addQuery('sys_id', 'IN', roleIds.join(','));
        gr.query();
        while (gr.next()) {
            names[gr.getUniqueValue()] = gr.getValue('name');
        }
        return names;
    },

    _roleIdNamed: function (roleNames, name) {
        for (var roleId in roleNames) {
            if (roleNames.hasOwnProperty(roleId) && roleNames[roleId] === name) {
                return roleId;
            }
        }
        return null;
    },

    _describeRoles: function (hopOf, roleNames) {
        var described = [];
        for (var roleId in hopOf) {
            if (!hopOf.hasOwnProperty(roleId)) {
                continue;
            }
            described.push({ role: roleId, roleName: roleNames[roleId] || roleId, hopCount: hopOf[roleId] });
        }
        return described;
    },

    type: 'BlastRadiusEvaluator'
};
