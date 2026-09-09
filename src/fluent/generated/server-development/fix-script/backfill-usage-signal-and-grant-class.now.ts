import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['backfill-usage-signal-and-grant-class'],
    table: 'sys_script_fix',
    data: {
        before: false,
        description:
            'One-time synthetic seed. Backfills last_exercised on every grant_inventory row with a weighted random distribution (~57% active/0-30d, ~23% aging/31-90d, ~20% dormant/91-450d, a handful of the dormant picks past 350d as outliers), then derives grant_class from last_exercised against the debt.aging_days / debt.dormancy_days thresholds. Not idempotent, not seeded -- re-running reshuffles every row. Deliberately NOT wired into the nightly rebuild job: GrantInventoryBuilder truncates and reinserts grant_inventory on every nightly run and does not populate last_exercised, so the next nightly execution will wipe this synthetic data (and grant_class along with it). Re-run this fix script after any nightly rebuild to restore it, until the real usage pipeline (or debt_snapshot) populates last_exercised organically.',
        name: 'Backfill usage signal and grant class',
        record_for_rollback: true,
        script: "new UsageSignalBuilder().backfillLastExercised();\nnew GrantClassCalculator().deriveGrantClass();",
        sys_name: 'Backfill usage signal and grant class',
        unloadable: false,
    },
})
