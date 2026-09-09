import { Property } from '@servicenow/sdk/core'

Property({
    $id: Now.ID['debt-dormancy-weight'],
    name: 'x_1906124_pantheon.debt.dormancy_weight',
    value: '1.0',
    description:
        'Weight applied to dormant_count when DebtScoreCalculator computes the instance access-debt score. See also debt.aging_weight.',
    type: 'string',
    ignoreCache: true,
})
