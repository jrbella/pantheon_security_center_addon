var DebtScoreCalculator = Class.create();
DebtScoreCalculator.prototype = {

    initialize: function () {
        this.table = 'x_1906124_pantheon_grant_inventory';
    },

    /**
     * Pure computation -- writes nothing, caller decides what to do with
     * the result. Instance-wide by default (scans all of grant_inventory).
     *
     * table/encodedQuery are an unused-today seam for a future
     * per-identity score: pass a narrower encodedQuery (e.g.
     * 'user=<sys_id>') to score a single identity's grants through the
     * same aggregate/weighting logic below, without rewriting it.
     */
    calculateInstanceDebtScore: function (table, encodedQuery) {
        var counts = this._countByGrantClass(table || this.table, encodedQuery);
        if (counts.total_count === 0) {
            return 0;
        }

        var dormancyWeight = parseFloat(gs.getProperty('x_1906124_pantheon.debt.dormancy_weight', '1.0'));
        var agingWeight = parseFloat(gs.getProperty('x_1906124_pantheon.debt.aging_weight', '0.4'));

        var rawScore = ((counts.dormant_count * dormancyWeight) + (counts.aging_count * agingWeight))
            / counts.total_count * 100;

        return this._round1(rawScore);
    },

    _countByGrantClass: function (table, encodedQuery) {
        var counts = { active_count: 0, aging_count: 0, dormant_count: 0, total_count: 0 };

        var ga = new GlideAggregate(table);
        if (encodedQuery) {
            ga.addEncodedQuery(encodedQuery);
        }
        ga.groupBy('grant_class');
        ga.addAggregate('COUNT');
        ga.query();

        while (ga.next()) {
            var grantClass = ga.getValue('grant_class');
            var count = parseInt(ga.getAggregate('COUNT'), 10);
            var key = grantClass + '_count';
            if (counts.hasOwnProperty(key)) {
                counts[key] = count;
            }
            counts.total_count += count;
        }

        return counts;
    },

    _round1: function (value) {
        return Math.round(value * 10) / 10;
    },

    type: 'DebtScoreCalculator'
};
