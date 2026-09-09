import { Property } from '@servicenow/sdk/core'

Property({
    $id: Now.ID['debt-aging-days'],
    name: 'x_1906124_pantheon.debt.aging_days',
    value: '30',
    description:
        'Days since last_exercised after which a grant_inventory record is classed aging in grant_class. Below this threshold it is classed active. See also debt.dormancy_days.',
    type: 'integer',
    ignoreCache: true,
})
