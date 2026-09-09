var BlastRadiusFindingBuilder = Class.create();
BlastRadiusFindingBuilder.prototype = {

    initialize: function () {
        this.table = 'x_1906124_pantheon_blast_radius_finding';
    },

    /**
     * Runs the full traversal + score pipeline for one entity and
     * upserts its row in blast_radius_finding (deletes any existing
     * row for this entity, then inserts fresh).
     *
     * Returns a flat summary object, primarily for the caller to log
     * (see the verification Fix Script) -- the stored record is the
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
        gr.insert();

        return {
            entityType: entityType,
            entitySysId: entitySysId,
            displayName: displayName,
            score: score,
            hopCount: traversal.hopCount,
            sensitiveTableCount: traversal.sensitiveTableCount,
            hasImpersonationEntitlement: traversal.hasImpersonationEntitlement,
            memberCount: traversal.memberCount
        };
    },

    _purgeExisting: function (entityType, entitySysId) {
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
