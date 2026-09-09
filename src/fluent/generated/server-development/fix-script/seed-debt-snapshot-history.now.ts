import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['seed-debt-snapshot-history'],
    table: 'sys_script_fix',
    data: {
        before: false,
        description:
            'One-time synthetic seed. Inserts 5 synthetic historical quarters into debt_snapshot (Q1 25 - Q1 26, trending downward) plus a 6th row for the current quarter (Q2 26) computed live via DebtScoreCalculator.calculateInstanceDebtScore(), so the seeded trend line is consistent with live grant_inventory data at its most recent point. Not idempotent -- re-running duplicates all 6 rows.',
        name: 'Seed debt snapshot history',
        record_for_rollback: true,
        script: 'new DebtSnapshotBuilder().seedHistoricalQuarters();',
        sys_name: 'Seed debt snapshot history',
        unloadable: false,
    },
})
