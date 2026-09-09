import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['debt-score-calculator'],
    name: 'DebtScoreCalculator',
    script: Now.include('./debt-score-calculator.server.js'),
    description:
        'Pure computation of an access-debt score from grant_inventory.grant_class distribution: ((dormant_count * debt.dormancy_weight) + (aging_count * debt.aging_weight)) / total_count * 100, rounded to 1 decimal. Writes nothing to any table -- the caller (e.g. DebtSnapshotBuilder) decides what to do with the number. calculateInstanceDebtScore() takes optional table/encodedQuery scope parameters so a future per-identity score can reuse the same GlideAggregate without a rewrite; today every caller leaves them unset and gets the instance-wide score.',
    apiName: 'x_1906124_pantheon.DebtScoreCalculator',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
