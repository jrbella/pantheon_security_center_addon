var RecommendationCalculator = Class.create();
RecommendationCalculator.prototype = {

    initialize: function () {
        this.grantTable = 'x_1906124_pantheon_grant_inventory';
        this.logTable = 'x_1906124_pantheon_usage_action_log';
    },

    /**
     * Pure computation -- writes nothing, caller (RecommendationBuilder)
     * decides what to do with the result. For each role currently held by
     * identitySysId (per grant_inventory), counts usage_action_log rows
     * requiring that role within the last rec.usage_window_days days.
     * count >= rec.min_actions_to_keep (default 1) -> 'keep', else 'remove'.
     *
     * Returns [{ roleSysId, roleName, usageCount, recommendation }, ...].
     */
    calculateRecommendations: function (identitySysId) {
        var roles = this._distinctRolesForIdentity(identitySysId);
        if (roles.length === 0) {
            return [];
        }

        var minActionsToKeep = parseInt(gs.getProperty('x_1906124_pantheon.rec.min_actions_to_keep', '1'), 10);
        var usageByRole = this._usageCountsByRole(identitySysId);

        var recommendations = [];
        for (var i = 0; i < roles.length; i++) {
            var role = roles[i];
            var usageCount = usageByRole[role.roleName] || 0;
            recommendations.push({
                roleSysId: role.roleSysId,
                roleName: role.roleName,
                usageCount: usageCount,
                recommendation: usageCount >= minActionsToKeep ? 'keep' : 'remove'
            });
        }
        return recommendations;
    },

    // See UsageActionLogBuilder._distinctRolesForIdentity -- same resolution
    // logic (grant_inventory.role is a sys_user_role sys_id, dedupe needed
    // because grant_inventory can carry duplicate grant rows). Kept as a
    // separate copy here rather than a shared dependency so this calculator
    // stays a pure, self-contained computation like DebtScoreCalculator.
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

    _usageCountsByRole: function (identitySysId) {
        var windowDays = parseInt(gs.getProperty('x_1906124_pantheon.rec.usage_window_days', '180'), 10);
        var cutoff = new GlideDateTime();
        cutoff.addDaysUTC(-windowDays);

        var counts = {};
        var ga = new GlideAggregate(this.logTable);
        ga.addQuery('identity', identitySysId);
        ga.addQuery('occurred_on', '>=', cutoff);
        ga.groupBy('role_required');
        ga.addAggregate('COUNT');
        ga.query();
        while (ga.next()) {
            counts[ga.getValue('role_required')] = parseInt(ga.getAggregate('COUNT'), 10);
        }
        return counts;
    },

    type: 'RecommendationCalculator'
};
