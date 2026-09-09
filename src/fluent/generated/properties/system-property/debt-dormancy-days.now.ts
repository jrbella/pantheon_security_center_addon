import { Property } from '@servicenow/sdk/core'

Property({
    $id: Now.ID['debt-dormancy-days'],
    name: 'x_1906124_pantheon.debt.dormancy_days',
    value: '90',
    description:
        'Days since last_exercised after which a grant_inventory record is classed dormant in grant_class. See also debt.aging_days.',
    type: 'integer',
    ignoreCache: true,
})
