var BlastRadiusFindingBuilder = Class.create();
BlastRadiusFindingBuilder.prototype = {

    initialize: function () {
        this.table = 'x_1906124_pantheon_blast_radius_finding';
        this.nodeTable = 'x_1906124_pantheon_blast_radius_node';
    },

    /**
     * Runs the full traversal + score pipeline for one entity and
     * upserts its row in blast_radius_finding -- updates the existing
     * row in place (score/hop_count/sensitive_table_count/computed_on)
     * if one already exists for this entity, keeping its sys_id/number
     * stable across re-runs, and only inserts a new row when none
     * exists yet. blast_radius_node children are always replaced fresh
     * (traversal detail, not worth diffing), but that no longer means
     * the finding's own identity churns on every re-run. Node
     * persistence is additive detail on top of the existing aggregate
     * -- it reads fields calculateBlastRadius() already returns
     * (reachableRoles, sensitiveTablesReached) and does not change the
     * score/hopCount/sensitiveTableCount calculation at all.
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

        var findingSysId = this._upsertFinding(entityType, entitySysId, displayName, score, traversal);

        this._purgeNodes(findingSysId);
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

    // Upserts the one blast_radius_finding row for this entity. Queries by
    // entity_type + entity_sys_id (newest computed_on first): if a row
    // already exists, updates it in place and returns its (unchanged)
    // sys_id -- this is what keeps the record's sys_id/number stable
    // across re-runs instead of churning on every computeAndStore call.
    // If more than one existing row is found (stale duplicates from
    // before this method upserted, or from a race), the most recently
    // computed one is kept/updated and the rest are purged via
    // _deleteFindingAndNodes -- the same helper dedupeFindings() uses for
    // its one-time cleanup pass. Only inserts a new row when none exists.
    _upsertFinding: function (entityType, entitySysId, displayName, score, traversal) {
        var gr = new GlideRecord(this.table);
        gr.addQuery('entity_type', entityType);
        gr.addQuery('entity_sys_id', entitySysId);
        gr.orderByDesc('computed_on');
        gr.query();

        var keeperSysId = null;
        while (gr.next()) {
            if (keeperSysId === null) {
                keeperSysId = gr.getUniqueValue();
            } else {
                this._deleteFindingAndNodes(gr.getUniqueValue());
            }
        }

        if (keeperSysId !== null) {
            var keeper = new GlideRecord(this.table);
            keeper.get(keeperSysId);
            keeper.setWorkflow(false);
            keeper.setValue('entity_name', displayName);
            keeper.setValue('score', score);
            keeper.setValue('hop_count', traversal.hopCount);
            keeper.setValue('sensitive_table_count', traversal.sensitiveTableCount);
            keeper.setValue('computed_on', new GlideDateTime());
            keeper.update();
            return keeperSysId;
        }

        var newGr = new GlideRecord(this.table);
        newGr.initialize();
        newGr.setWorkflow(false);
        newGr.setValue('entity_type', entityType);
        newGr.setValue('entity_sys_id', entitySysId);
        newGr.setValue('entity_name', displayName);
        newGr.setValue('score', score);
        newGr.setValue('hop_count', traversal.hopCount);
        newGr.setValue('sensitive_table_count', traversal.sensitiveTableCount);
        newGr.setValue('computed_on', new GlideDateTime());
        return newGr.insert();
    },

    // Deletes every blast_radius_node row referencing this finding, ahead
    // of _storeNodes writing a fresh set -- traversal detail is always
    // replaced wholesale on recompute, never diffed.
    _purgeNodes: function (findingSysId) {
        var nodeGr = new GlideRecord(this.nodeTable);
        nodeGr.addQuery('finding', findingSysId);
        nodeGr.setWorkflow(false);
        nodeGr.deleteMultiple();
    },

    // Deletes one blast_radius_finding row and its blast_radius_node
    // children. Shared by _upsertFinding (purging surplus duplicates found
    // mid-upsert) and dedupeFindings (the one-time cleanup pass). Returns
    // the number of node rows deleted, for cleanup reporting.
    _deleteFindingAndNodes: function (findingSysId) {
        var nodeGr = new GlideRecord(this.nodeTable);
        nodeGr.addQuery('finding', findingSysId);
        nodeGr.setWorkflow(false);
        nodeGr.query();
        var nodeCount = 0;
        while (nodeGr.next()) {
            nodeGr.deleteRecord();
            nodeCount++;
        }

        var findingGr = new GlideRecord(this.table);
        findingGr.setWorkflow(false);
        if (findingGr.get(findingSysId)) {
            findingGr.deleteRecord();
        }

        return nodeCount;
    },

    /**
     * One-time cleanup for duplicate blast_radius_finding rows left over
     * from before computeAndStore upserted (each earlier run inserted a
     * fresh row instead of updating one in place). Groups all finding
     * rows by entity_type + entity_sys_id, keeps the most recently
     * computed row per entity, and deletes the rest along with their
     * orphaned blast_radius_node children. Safe to call any time -- a
     * no-op once there are no duplicates left, since every entity then
     * has exactly one group member.
     *
     * Returns { entitiesWithDuplicates, deletedFindings, deletedNodes }.
     */
    dedupeFindings: function () {
        var byEntity = {};
        var gr = new GlideRecord(this.table);
        gr.orderByDesc('computed_on');
        gr.query();
        while (gr.next()) {
            var key = gr.getValue('entity_type') + ':' + gr.getValue('entity_sys_id');
            if (!byEntity[key]) {
                byEntity[key] = [];
            }
            byEntity[key].push(gr.getUniqueValue());
        }

        var entitiesWithDuplicates = 0;
        var deletedFindings = 0;
        var deletedNodes = 0;
        for (var key in byEntity) {
            if (!byEntity.hasOwnProperty(key)) {
                continue;
            }
            var ids = byEntity[key]; // newest-first, per the orderByDesc query above
            if (ids.length > 1) {
                entitiesWithDuplicates++;
            }
            for (var i = 1; i < ids.length; i++) {
                deletedNodes += this._deleteFindingAndNodes(ids[i]);
                deletedFindings++;
            }
        }

        return {
            entitiesWithDuplicates: entitiesWithDuplicates,
            deletedFindings: deletedFindings,
            deletedNodes: deletedNodes
        };
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
