var UsageActionLogBuilder = Class.create();
UsageActionLogBuilder.prototype = {

    initialize: function () {
        this.table = 'x_1906124_pantheon_usage_action_log';
        this.grantTable = 'x_1906124_pantheon_grant_inventory';

        // Of an identity's currently-held distinct roles, this many (floor of
        // half, clamped to [3, 6] per the delivery plan) are seeded as the
        // "real usage" KEEP set; the remainder get zero actions logged
        // against them and become the REMOVE set. Heavier roles are listed
        // first in _KEEP_SHARE and get a decreasing share of the total
        // action volume, mirroring the wireframe's itil (1,204) / hr_case
        // -reader (312) / mostly-zero pattern.
        this.MIN_KEEP_ROLES = 3;
        this.MAX_KEEP_ROLES = 6;
        this.KEEP_SHARE = [0.65, 0.25, 0.10, 0.045, 0.035, 0.02];

        this.TOTAL_ACTIONS = 600;

        this.ACTION_VERBS = ['viewed', 'updated', 'reviewed', 'processed', 'commented on', 'closed'];
    },

    /**
     * Not idempotent across identities sharing this builder run, but safe to
     * re-run for the SAME identity: purges that identity's existing
     * usage_action_log rows first (see _purgeForIdentity), so re-running
     * replaces the synthetic set instead of piling duplicates on top of it --
     * the log-table equivalent of the upsert discipline used for
     * one-row-per-entity tables elsewhere in this app.
     *
     * Returns { identitySysId, roles: [{roleSysId, roleName, actionsLogged}],
     * totalActions }.
     */
    backfillActionLog: function (identitySysId) {
        var roles = this._distinctRolesForIdentity(identitySysId);
        if (roles.length === 0) {
            gs.error('PANTHEON | UsageActionLogBuilder.backfillActionLog | no grant_inventory roles found for identity=' + identitySysId);
            return { identitySysId: identitySysId, roles: [], totalActions: 0 };
        }

        this._purgeForIdentity(identitySysId);

        var keepCount = Math.min(this.MAX_KEEP_ROLES, Math.max(this.MIN_KEEP_ROLES, Math.floor(roles.length / 2)));
        keepCount = Math.min(keepCount, roles.length);

        var windowDays = parseInt(gs.getProperty('x_1906124_pantheon.rec.usage_window_days', '180'), 10);
        var result = { identitySysId: identitySysId, roles: [], totalActions: 0 };

        for (var i = 0; i < roles.length; i++) {
            var role = roles[i];
            var actionsForRole = 0;
            if (i < keepCount) {
                var share = this.KEEP_SHARE[i] || 0;
                actionsForRole = Math.round(this.TOTAL_ACTIONS * share);
                this._insertActions(identitySysId, role.roleName, actionsForRole, windowDays);
            }
            result.roles.push({ roleSysId: role.roleSysId, roleName: role.roleName, actionsLogged: actionsForRole });
            result.totalActions += actionsForRole;
        }

        gs.info('PANTHEON | UsageActionLogBuilder.backfillActionLog | identity=' + identitySysId +
                ' totalActions=' + result.totalActions +
                ' keepRoles=' + keepCount + '/' + roles.length);
        return result;
    },

    // Distinct effective roles currently held by this identity, resolved
    // from grant_inventory. grant_inventory.role stores the sys_user_role
    // sys_id directly (despite its dictionary declaring a sys_user_has_role
    // reference table -- a pre-existing quirk from an earlier module, not
    // something this builder corrects). grant_inventory itself can carry
    // duplicate rows for the same (user, role) pair from before the
    // upsert lesson was applied, so dedupe by role sys_id here.
    _distinctRolesForIdentity: function (identitySysId) {
        var seen = {};
        var order = [];

        var gr = new GlideRecord(this.grantTable);
        gr.addQuery('user', identitySysId);
        gr.query();
        while (gr.next()) {
            var roleSysId = gr.getValue('role');
            if (!roleSysId || seen[roleSysId]) {
                continue;
            }
            seen[roleSysId] = true;
            order.push(roleSysId);
        }

        var roles = [];
        for (var i = 0; i < order.length; i++) {
            var roleGr = new GlideRecord('sys_user_role');
            if (roleGr.get(order[i])) {
                roles.push({ roleSysId: order[i], roleName: roleGr.getValue('name') });
            }
        }
        return roles;
    },

    _purgeForIdentity: function (identitySysId) {
        var gr = new GlideRecord(this.table);
        gr.addQuery('identity', identitySysId);
        gr.setWorkflow(false);
        gr.deleteMultiple();
    },

    _insertActions: function (identitySysId, roleName, count, windowDays) {
        var shortRoleLabel = roleName.indexOf('.') >= 0 ? roleName.split('.').pop() : roleName;
        shortRoleLabel = shortRoleLabel.replace(/_/g, ' ');

        for (var i = 0; i < count; i++) {
            var verb = this.ACTION_VERBS[Math.floor(Math.random() * this.ACTION_VERBS.length)];
            var daysAgo = Math.floor(Math.random() * windowDays);

            var occurredOn = new GlideDateTime();
            occurredOn.addDaysUTC(-daysAgo);

            var gr = new GlideRecord(this.table);
            gr.initialize();
            gr.setWorkflow(false);
            gr.setValue('identity', identitySysId);
            gr.setValue('role_required', roleName);
            gr.setValue('action_type', verb + ' ' + shortRoleLabel + ' item');
            gr.setValue('occurred_on', occurredOn);
            gr.insert();
        }
    },

    type: 'UsageActionLogBuilder'
};
