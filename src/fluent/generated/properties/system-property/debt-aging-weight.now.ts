import { Property } from '@servicenow/sdk/core'

Property({
    $id: Now.ID['debt-aging-weight'],
    name: 'x_1906124_pantheon.debt.aging_weight',
    value: '0.4',
    description:
        'Weight applied to aging_count when DebtScoreCalculator computes the instance access-debt score. See also debt.dormancy_weight.',
    type: 'string',
    ignoreCache: true,
})
