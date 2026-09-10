var RecommendationBuilder = Class.create();
RecommendationBuilder.prototype = {

    initialize: function () {
        this.table = 'x_1906124_pantheon_role_recommendation';
        this.taskTable = 'sn_vsc_security_task';
    },

    /**
     * Runs RecommendationCalculator for identitySysId and upserts one
     * role_recommendation row per role -- queries by identity+role first and
     * updates current_usage_count/recommendation in place when a row already
     * exists (keeping its sys_id/number/disposition/justification/review
     * fields stable across re-runs), only inserting a new row (disposition
     * 'pending') when none exists yet. A prior human review (disposition,
     * justification, reviewed_by/on) is intentionally left untouched on
     * recompute -- only the computed fields are refreshed.
     *
     * Returns [{ recommendationSysId, roleSysId, roleName, usageCount,
     * recommendation, disposition }, ...].
     */
    materializeRecommendations: function (identitySysId) {
        var recommendations = new RecommendationCalculator().calculateRecommendations(identitySysId);
        var results = [];

        for (var i = 0; i < recommendations.length; i++) {
            var rec = recommendations[i];
            results.push(this._upsertRecommendation(identitySysId, rec));
        }

        gs.info('PANTHEON | RecommendationBuilder.materializeRecommendations | identity=' + identitySysId +
                ' rows=' + results.length);
        return results;
    },

    _upsertRecommendation: function (identitySysId, rec) {
        var gr = new GlideRecord(this.table);
        gr.addQuery('identity', identitySysId);
        gr.addQuery('role', rec.roleSysId);
        gr.query();

        if (gr.next()) {
            gr.setWorkflow(false);
            gr.setValue('current_usage_count', rec.usageCount);
            gr.setValue('recommendation', rec.recommendation);
            gr.update();
            return {
                recommendationSysId: gr.getUniqueValue(),
                roleSysId: rec.roleSysId,
                roleName: rec.roleName,
                usageCount: rec.usageCount,
                recommendation: rec.recommendation,
                disposition: gr.getValue('disposition')
            };
        }

        var newGr = new GlideRecord(this.table);
        newGr.initialize();
        newGr.setWorkflow(false);
        newGr.setValue('identity', identitySysId);
        newGr.setValue('role', rec.roleSysId);
        newGr.setValue('current_usage_count', rec.usageCount);
        newGr.setValue('recommendation', rec.recommendation);
        newGr.setValue('disposition', 'pending');
        var newSysId = newGr.insert();
        return {
            recommendationSysId: newSysId,
            roleSysId: rec.roleSysId,
            roleName: rec.roleName,
            usageCount: rec.usageCount,
            recommendation: rec.recommendation,
            disposition: 'pending'
        };
    },

    /**
     * Sets disposition='applied' with the reviewer/justification, and opens
     * a real sn_vsc_security_task (the out-of-box "Security tasks" table,
     * extends task) carrying the justification and a back-reference to the
     * recommendation record. Returns { recommendationSysId, disposition,
     * securityTaskSysId, securityTaskNumber }. Throws if recommendationSysId
     * does not resolve to a role_recommendation row.
     */
    applyRecommendation: function (recommendationSysId, justification) {
        var gr = new GlideRecord(this.table);
        if (!gr.get(recommendationSysId)) {
            throw new Error('role_recommendation not found: ' + recommendationSysId);
        }

        gr.setWorkflow(false);
        gr.setValue('disposition', 'applied');
        gr.setValue('justification', justification || '');
        gr.setValue('reviewed_by', gs.getUserID());
        gr.setValue('reviewed_on', new GlideDateTime());
        gr.update();

        var task = this._openSecurityTask(gr, justification);

        return {
            recommendationSysId: recommendationSysId,
            disposition: 'applied',
            securityTaskSysId: task.sysId,
            securityTaskNumber: task.number
        };
    },

    /**
     * Sets disposition='rejected' with the reviewer/justification. No
     * security task is opened -- rejecting a recommendation means no action
     * is being taken. Returns { recommendationSysId, disposition }. Throws
     * if recommendationSysId does not resolve to a role_recommendation row.
     */
    rejectRecommendation: function (recommendationSysId, justification) {
        var gr = new GlideRecord(this.table);
        if (!gr.get(recommendationSysId)) {
            throw new Error('role_recommendation not found: ' + recommendationSysId);
        }

        gr.setWorkflow(false);
        gr.setValue('disposition', 'rejected');
        gr.setValue('justification', justification || '');
        gr.setValue('reviewed_by', gs.getUserID());
        gr.setValue('reviewed_on', new GlideDateTime());
        gr.update();

        return { recommendationSysId: recommendationSysId, disposition: 'rejected' };
    },

    _openSecurityTask: function (recommendationGr, justification) {
        var roleGr = new GlideRecord('sys_user_role');
        var roleName = roleGr.get(recommendationGr.getValue('role')) ? roleGr.getValue('name') : recommendationGr.getValue('role');

        var identityGr = new GlideRecord('sys_user');
        var identityName = identityGr.get(recommendationGr.getValue('identity')) ? identityGr.getDisplayValue() : recommendationGr.getValue('identity');

        var taskGr = new GlideRecord(this.taskTable);
        taskGr.initialize();
        taskGr.setWorkflow(false);
        taskGr.setValue('short_description',
            'Apply least-privilege recommendation: ' + recommendationGr.getValue('recommendation').toUpperCase() +
            ' role ' + roleName + ' for ' + identityName);
        taskGr.setValue('details', justification || '');
        taskGr.setValue('source_table', this.table);
        taskGr.setValue('source_record', recommendationGr.getUniqueValue());
        var sysId = taskGr.insert();

        return { sysId: sysId, number: taskGr.getValue('number') };
    },

    type: 'RecommendationBuilder'
};
