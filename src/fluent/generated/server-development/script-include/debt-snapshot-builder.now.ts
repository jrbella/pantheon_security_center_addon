import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['debt-snapshot-builder'],
    name: 'DebtSnapshotBuilder',
    script: Now.include('./debt-snapshot-builder.server.js'),
    description:
        'One-time synthetic seed for debt_snapshot. Writes 5 synthetic historical quarters (Q1 25 - Q1 26, trending downward) plus a 6th row for the current quarter (Q2 26), which is NOT hardcoded -- it calls DebtScoreCalculator.calculateInstanceDebtScore() live, so the seeded trend line stays consistent with whatever grant_inventory actually holds at its most recent point. Run once via a Fix Script, not on a schedule -- not idempotent, re-running duplicates all 6 rows.',
    apiName: 'x_1906124_pantheon.DebtSnapshotBuilder',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
