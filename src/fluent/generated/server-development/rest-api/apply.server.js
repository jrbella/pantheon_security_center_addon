(function process(request, response) {
    try {
        var body = (request.body && request.body.data) ? request.body.data : {};
        var recommendationSysId = body.recommendationSysId;
        var justification = body.justification || '';

        if (!recommendationSysId) {
            response.setStatus(400);
            response.setBody({ error: 'recommendationSysId is required' });
            return;
        }

        var result = new RecommendationBuilder().applyRecommendation(recommendationSysId, justification);
        response.setBody(result);
    } catch (e) {
        gs.error('PANTHEON | recommendations/apply | ' + e.message);
        response.setStatus(500);
        response.setBody({ error: e.message });
    }
})(request, response);
