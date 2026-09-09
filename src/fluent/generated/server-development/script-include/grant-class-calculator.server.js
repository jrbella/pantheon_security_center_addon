var GrantClassCalculator = Class.create();
GrantClassCalculator.prototype = {

    initialize: function () {
        this.table = 'x_1906124_pantheon_grant_inventory';
    },

    /**
     * Reads the debt.aging_days / debt.dormancy_days thresholds and sets
     * grant_class on every row from its last_exercised date. Rows with no
     * last_exercised are skipped and counted, not defaulted -- run
     * UsageSignalBuilder.backfillLastExercised first (or let the real
     * usage pipeline populate it) so this has something to compute from.
     */
    deriveGrantClass: function () {
        var agingDays = parseInt(gs.getProperty('x_1906124_pantheon.debt.aging_days', '30'), 10);
        var dormancyDays = parseInt(gs.getProperty('x_1906124_pantheon.debt.dormancy_days', '90'), 10);

        var now = new GlideDateTime();
        var counts = { active: 0, aging: 0, dormant: 0, skipped: 0 };
        var processed = 0;

        var gr = new GlideRecord(this.table);
        gr.query();

        while (gr.next()) {
            var lastExercisedValue = gr.getValue('last_exercised');
            if (!lastExercisedValue) {
                counts.skipped++;
                continue;
            }

            var exercisedOn = new GlideDateTime(lastExercisedValue);
            var daysSince = GlideDateTime.subtract(exercisedOn, now).getDayPart();

            var grantClass;
            if (daysSince >= dormancyDays) {
                grantClass = 'dormant';
            } else if (daysSince >= agingDays) {
                grantClass = 'aging';
            } else {
                grantClass = 'active';
            }
            counts[grantClass]++;

            gr.setWorkflow(false);
            gr.setValue('grant_class', grantClass);
            gr.update();

            processed++;
            if (processed % 5000 === 0) {
                this._logProgress(processed, counts);
            }
        }

        this._logProgress(processed, counts);
        return counts;
    },

    _logProgress: function (processed, counts) {
        gs.info('PANTHEON | GrantClassCalculator.deriveGrantClass | processed=' + processed +
                ' active=' + counts.active +
                ' aging=' + counts.aging +
                ' dormant=' + counts.dormant +
                ' skipped(no last_exercised)=' + counts.skipped);
    },

    type: 'GrantClassCalculator'
};
