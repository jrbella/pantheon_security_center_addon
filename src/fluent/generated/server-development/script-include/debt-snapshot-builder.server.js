var DebtSnapshotBuilder = Class.create();
DebtSnapshotBuilder.prototype = {

    initialize: function () {
        this.table = 'x_1906124_pantheon_debt_snapshot';

        // Five synthetic historical quarters, hand-picked to trend downward
        // toward whatever calculateInstanceDebtScore() returns live for the
        // sixth (current) quarter. Not derived from any real signal -- seed
        // data only, to give the trend-line wireframe something to show.
        this.SYNTHETIC_QUARTERS = [
            { quarter: 'Q1 25', score: 49.5 },
            { quarter: 'Q2 25', score: 46.8 },
            { quarter: 'Q3 25', score: 43.1 },
            { quarter: 'Q4 25', score: 38.6 },
            { quarter: 'Q1 26', score: 35.2 }
        ];
        this.CURRENT_QUARTER = 'Q2 26';
    },

    /**
     * Not idempotent -- intended as a single one-time Fix Script run.
     * Re-running inserts a second set of 6 rows.
     */
    seedHistoricalQuarters: function () {
        var computedOn = new GlideDateTime();
        var inserted = 0;

        for (var i = 0; i < this.SYNTHETIC_QUARTERS.length; i++) {
            inserted += this._insertSnapshot(
                this.SYNTHETIC_QUARTERS[i].quarter,
                this.SYNTHETIC_QUARTERS[i].score,
                computedOn
            );
        }

        var currentScore = new DebtScoreCalculator().calculateInstanceDebtScore();
        inserted += this._insertSnapshot(this.CURRENT_QUARTER, currentScore, computedOn);

        gs.info('PANTHEON | DebtSnapshotBuilder.seedHistoricalQuarters | inserted=' + inserted +
                ' currentQuarter=' + this.CURRENT_QUARTER + ' currentScore=' + currentScore);
        return inserted;
    },

    _insertSnapshot: function (quarter, score, computedOn) {
        var gr = new GlideRecord(this.table);
        gr.initialize();
        gr.setWorkflow(false);
        gr.setValue('quarter', quarter);
        gr.setValue('score', score);
        gr.setValue('computed_on', computedOn);
        return gr.insert() ? 1 : 0;
    },

    type: 'DebtSnapshotBuilder'
};
