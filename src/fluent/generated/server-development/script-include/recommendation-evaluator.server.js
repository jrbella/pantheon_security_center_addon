var RecommendationEvaluator = Class.create();
RecommendationEvaluator.prototype = {

    initialize: function () {
        // Demo placeholders -- no apply-history exists yet on this PDI to
        // compute these from (RecommendationBuilder.applyRecommendation has
        // only just been built and exercised a handful of times). Replace
        // with a real query over role_recommendation.disposition history
        // once enough applied/rejected recommendations have accumulated.
        this.PLACEHOLDER_ACCEPTANCE_RATE_PCT = 82.0;
        this.PLACEHOLDER_ROLLBACK_RATE_PCT = 1.5;
    },

    /**
     * Pure computation -- writes nothing. Replays every usage_action_log
     * action logged for identitySysId in the rec.usage_window_days window
     * against RecommendationCalculator's proposed KEEP set: an action is
     * "allowed" if its role_required is a role recommended KEEP, "blocked"
     * otherwise. With the default rec.min_actions_to_keep=1, this is 100%
     * by construction -- every logged action's role has usageCount >= 1 and
     * is therefore recommended KEEP, so no action can end up blocked. Only
     * raising the threshold above 1 could make a role's true (nonzero, but
     * below-threshold) usage get recommended REMOVE, which would then show
     * up here as a blocked action -- expected behavior, not a bug.
     *
     * Returns { totalActions, allowedActions, blockedActions, successRatePct }.
     */
    simulateReduction: function (identitySysId) {
        var recommendations = new RecommendationCalculator().calculateRecommendations(identitySysId);

        var totalActions = 0;
        var allowedActions = 0;
        for (var i = 0; i < recommendations.length; i++) {
            var rec = recommendations[i];
            totalActions += rec.usageCount;
            if (rec.recommendation === 'keep') {
                allowedActions += rec.usageCount;
            }
        }

        var blockedActions = totalActions - allowedActions;
        var successRatePct = totalActions > 0 ? this._round1((allowedActions / totalActions) * 100) : 100;

        return {
            totalActions: totalActions,
            allowedActions: allowedActions,
            blockedActions: blockedActions,
            successRatePct: successRatePct
        };
    },

    /**
     * Pilot metrics for the results panel. avgRolesBeforePerUser /
     * avgRolesAfterPerUser are real, computed from RecommendationCalculator
     * for identitySysId (sampleSize is 1 -- only this one identity has been
     * processed through the module so far on this PDI; this is an average
     * over a sample of one, not a fleet-wide figure). acceptanceRatePct and
     * rollbackRatePct are static demo placeholders per the delivery plan's
     * "Partial" call on pilot metrics -- see PLACEHOLDER_* above.
     */
    getPilotMetrics: function (identitySysId) {
        var recommendations = new RecommendationCalculator().calculateRecommendations(identitySysId);
        var keepCount = 0;
        for (var i = 0; i < recommendations.length; i++) {
            if (recommendations[i].recommendation === 'keep') {
                keepCount++;
            }
        }

        return {
            avgRolesBeforePerUser: recommendations.length,
            avgRolesAfterPerUser: keepCount,
            sampleSize: 1,
            acceptanceRatePct: this.PLACEHOLDER_ACCEPTANCE_RATE_PCT,
            rollbackRatePct: this.PLACEHOLDER_ROLLBACK_RATE_PCT,
            isPlaceholder: { acceptanceRatePct: true, rollbackRatePct: true }
        };
    },

    _round1: function (value) {
        return Math.round(value * 10) / 10;
    },

    type: 'RecommendationEvaluator'
};
