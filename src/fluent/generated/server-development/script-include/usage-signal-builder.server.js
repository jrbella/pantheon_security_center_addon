var UsageSignalBuilder = Class.create();
UsageSignalBuilder.prototype = {

    initialize: function () {
        this.table = 'x_1906124_pantheon_grant_inventory';

        // Weighted bucket boundaries against Math.random() in [0, 1):
        //   [0, ACTIVE_CUTOFF)                -> active   (~57%, target 55-60%)
        //   [ACTIVE_CUTOFF, AGING_CUTOFF)      -> aging    (~23%, target 20-25%)
        //   [AGING_CUTOFF, 1)                  -> dormant  (~20%, target 15-20%)
        this.ACTIVE_CUTOFF = 0.57;
        this.AGING_CUTOFF = 0.80;

        // Of the dormant picks, this fraction (~15%, i.e. ~3% of all rows)
        // is pushed past 350 days so the dormant list has real outliers.
        this.DORMANT_OUTLIER_SHARE = 0.15;
    },

    /**
     * Not idempotent by design -- re-running reshuffles every row's
     * last_exercised. Not seeded; repeatability isn't required for a
     * one-time synthetic seed run. A resettable demo variant, if ever
     * needed, is a separate script, not this method.
     */
    backfillLastExercised: function () {
        var counts = { active: 0, aging: 0, dormant: 0, dormantOutlier: 0 };
        var processed = 0;

        var gr = new GlideRecord(this.table);
        gr.query();

        while (gr.next()) {
            var pick = this._pickDaysAgo();
            counts[pick.bucket]++;
            if (pick.outlier) {
                counts.dormantOutlier++;
            }

            var exercisedOn = new GlideDateTime();
            exercisedOn.addDaysUTC(-pick.daysAgo);

            gr.setWorkflow(false);
            gr.setValue('last_exercised', exercisedOn);
            gr.update();

            processed++;
            if (processed % 5000 === 0) {
                this._logProgress(processed, counts);
            }
        }

        this._logProgress(processed, counts);
        return counts;
    },

    // Returns { bucket: 'active'|'aging'|'dormant', daysAgo: number, outlier: boolean }
    _pickDaysAgo: function () {
        var r = Math.random();

        if (r < this.ACTIVE_CUTOFF) {
            return { bucket: 'active', daysAgo: Math.floor(Math.random() * 31), outlier: false }; // 0-30
        }

        if (r < this.AGING_CUTOFF) {
            return { bucket: 'aging', daysAgo: 31 + Math.floor(Math.random() * 60), outlier: false }; // 31-90
        }

        if (Math.random() < this.DORMANT_OUTLIER_SHARE) {
            return { bucket: 'dormant', daysAgo: 351 + Math.floor(Math.random() * 100), outlier: true }; // 351-450
        }
        return { bucket: 'dormant', daysAgo: 91 + Math.floor(Math.random() * 260), outlier: false }; // 91-350
    },

    _logProgress: function (processed, counts) {
        gs.info('PANTHEON | UsageSignalBuilder.backfillLastExercised | processed=' + processed +
                ' active=' + counts.active +
                ' aging=' + counts.aging +
                ' dormant=' + counts.dormant +
                ' dormantOutliers(>350d)=' + counts.dormantOutlier);
    },

    type: 'UsageSignalBuilder'
};
