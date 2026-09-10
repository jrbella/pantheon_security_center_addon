(function process(request, response) {
    function firstParam(value) {
        if (Array.isArray(value)) {
            return value[0] || '';
        }
        return value || '';
    }

    try {
        var identitySysId = firstParam(request.queryParams.identity);
        if (!identitySysId) {
            response.setStatus(400);
            response.setBody({ error: 'identity query parameter is required' });
            return;
        }

        new RecommendationBuilder().materializeRecommendations(identitySysId);

        var roles = [];
        var gr = new GlideRecord('x_1906124_pantheon_role_recommendation');
        gr.addQuery('identity', identitySysId);
        gr.orderByDesc('current_usage_count');
        gr.query();
        while (gr.next()) {
            roles.push({
                sysId: gr.getUniqueValue(),
                roleSysId: gr.getValue('role'),
                roleName: gr.getDisplayValue('role'),
                usageCount: parseInt(gr.getValue('current_usage_count'), 10) || 0,
                recommendation: gr.getValue('recommendation'),
                disposition: gr.getValue('disposition'),
                justification: gr.getValue('justification') || ''
            });
        }

        var identityGr = new GlideRecord('sys_user');
        var identityName = identityGr.get(identitySysId) ? identityGr.getDisplayValue() : identitySysId;

        var evaluator = new RecommendationEvaluator();
        var simulation = evaluator.simulateReduction(identitySysId);
        var pilotMetrics = evaluator.getPilotMetrics(identitySysId);

        response.setBody({
            identity: { sysId: identitySysId, name: identityName },
            roles: roles,
            simulation: simulation,
            pilotMetrics: pilotMetrics
        });
    } catch (e) {
        gs.error('PANTHEON | recommendations/get-summary | ' + e.message);
        response.setStatus(500);
        response.setBody({ error: e.message });
    }
})(request, response);
