var BlastRadiusFindingBuilder = Class.create();
BlastRadiusFindingBuilder.prototype = {

    initialize: function () {
        this.table = 'x_1906124_pantheon_blast_radius_finding';
        this.nodeTable = 'x_1906124_pantheon_blast_radius_node';
    },

    /**
     * Runs the full traversal + score pipeline for one entity and
     * upserts its row in blast_radius_finding (deletes any existing
     * row -- and its blast_radius_node children -- for this entity,
     * then inserts fresh), then persists every individual reachable
     * entity from the same traversal result as a blast_radius_node
     * row referencing the new finding. Node persistence is additive
     * detail on top of the existing aggregate -- it reads fields
     * calculateBlastRadius() already returns (reachableRoles,
     * sensitiveTablesReached) and does not change the score/hopCount/
     * sensitiveTableCount calculation at all.
     *
     * Returns a flat summary object, primarily for the caller to log
     * (see the verification Fix Script) -- the stored records are the
     * durable result.
     */
    computeAndStore: function (entityType, entitySysId) {
        var evaluator = new BlastRadiusEvaluator();
        var traversal = evaluator.calculateBlastRadius(entityType, entitySysId);
        var score = evaluator.calculateBlastRadiusScore(traversal);
        var displayName = this._resolveDisplayName(entityType, entitySysId);

        this._purgeExisting(entityType, entitySysId);

        var gr = new GlideRecord(this.table);
        gr.initialize();
        gr.setWorkflow(false);
        gr.setValue('entity_type', entityType);
        gr.setValue('entity_sys_id', entitySysId);
        gr.setValue('entity_name', displayName);
        gr.setValue('score', score);
        gr.setValue('hop_count', traversal.hopCount);
        gr.setValue('sensitive_table_count', traversal.sensitiveTableCount);
        gr.setValue('computed_on', new GlideDateTime());
        var findingSysId = gr.insert();

        var nodeCount = this._storeNodes(findingSysId, traversal);

        return {
            entityType: entityType,
            entitySysId: entitySysId,
            displayName: displayName,
            score: score,
            hopCount: traversal.hopCount,
            sensitiveTableCount: traversal.sensitiveTableCount,
            hasImpersonationEntitlement: traversal.hasImpersonationEntitlement,
            memberCount: traversal.memberCount,
            nodeCount: nodeCount
        };
    },

    // Writes one blast_radius_node row per entry in traversal.reachableRoles
    // (category 'role') and traversal.sensitiveTablesReached (category
    // 'table') -- the two entity lists calculateBlastRadius() actually
    // distinguishes internally. is_sensitive is true only for table nodes:
    // those are exactly the entries that cross-referenced as a hit against
    // sensitive_table_register, per _sensitiveTablesReached on the
    // evaluator. Roles never hit the register directly, so role nodes are
    // always is_sensitive=false, including the impersonator role itself --
    // hasImpersonationEntitlement is a derived flag over the same role
    // list, not a distinct traversal artifact with its own node data.
    //
    // record_sys_id carries the real underlying record for each node, so
    // the UI can link out to it: role.role is already the sys_user_role
    // sys_id straight from the evaluator's traversal (no extra lookup
    // needed). Table entries only carry a table NAME string from the
    // evaluator (sensitive_table_register is keyed by name, not sys_id),
    // so those are resolved to their sys_db_object sys_id here via
    // _resolveTableSysIds -- a persistence-time lookup, not a change to
    // the evaluator's traversal or scoring logic.
    _storeNodes: function (findingSysId, traversal) {
        var count = 0;
        var i;

        for (i = 0; i < traversal.reachableRoles.length; i++) {
            var role = traversal.reachableRoles[i];
            this._insertNode(findingSysId, role.roleName, 'role', role.hopCount, false, role.role);
            count++;
        }

        var tableSysIds = this._resolveTableSysIds(traversal.sensitiveTablesReached);
        for (i = 0; i < traversal.sensitiveTablesReached.length; i++) {
            var table = traversal.sensitiveTablesReached[i];
            this._insertNode(findingSysId, table.table, 'table', table.hopCount, true, tableSysIds[table.table]);
            count++;
        }

        return count;
    },

    // Resolves each sensitive table's name to its table definition
    // record's sys_id, one IN-query rather than one query per table.
    // sys_db_object confirmed (not assumed) as the correct table: it's
    // literally the `name` on the sys_app_module row backing System
    // Definition > Tables in the platform's own navigation.
    _resolveTableSysIds: function (sensitiveTablesReached) {
        var map = {};
        if (sensitiveTablesReached.length === 0) {
            return map;
        }
        var names = [];
        for (var i = 0; i < sensitiveTablesReached.length; i++) {
            names.push(sensitiveTablesReached[i].table);
        }
        var gr = new GlideRecord('sys_db_object');
        gr.addQuery('name', 'IN', names.join(','));
        gr.query();
        while (gr.next()) {
            map[gr.getValue('name')] = gr.getUniqueValue();
        }
        return map;
    },

    _insertNode: function (findingSysId, label, category, hopDistance, isSensitive, recordSysId) {
        var gr = new GlideRecord(this.nodeTable);
        gr.initialize();
        gr.setWorkflow(false);
        gr.setValue('finding', findingSysId);
        gr.setValue('label', label);
        gr.setValue('category', category);
        gr.setValue('hop_distance', hopDistance);
        gr.setValue('is_sensitive', isSensitive);
        gr.setValue('record_sys_id', recordSysId || '');
        gr.insert();
    },

    // Deletes any existing blast_radius_finding row for this entity, and
    // -- first, since the finding sys_id changes on every upsert -- any
    // blast_radius_node rows that reference it, so re-running never leaves
    // orphaned node rows behind.
    _purgeExisting: function (entityType, entitySysId) {
        var findingIds = [];
        var findGr = new GlideRecord(this.table);
        findGr.addQuery('entity_type', entityType);
        findGr.addQuery('entity_sys_id', entitySysId);
        findGr.query();
        while (findGr.next()) {
            findingIds.push(findGr.getUniqueValue());
        }

        if (findingIds.length > 0) {
            var nodeGr = new GlideRecord(this.nodeTable);
            nodeGr.addQuery('finding', 'IN', findingIds.join(','));
            nodeGr.setWorkflow(false);
            nodeGr.deleteMultiple();
        }

        var gr = new GlideRecord(this.table);
        gr.addQuery('entity_type', entityType);
        gr.addQuery('entity_sys_id', entitySysId);
        gr.setWorkflow(false);
        gr.deleteMultiple();
    },

    _resolveDisplayName: function (entityType, entitySysId) {
        var table = (entityType === 'group') ? 'sys_user_group' : 'sys_user';
        var gr = new GlideRecord(table);
        if (gr.get(entitySysId)) {
            return gr.getDisplayValue();
        }
        return entitySysId;
    },

    type: 'BlastRadiusFindingBuilder'
};
