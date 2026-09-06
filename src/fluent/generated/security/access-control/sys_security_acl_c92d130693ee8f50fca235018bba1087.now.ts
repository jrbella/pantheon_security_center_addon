import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['c92d130693ee8f50fca235018bba1087'],
    description:
        'Allow read for records in x_1906124_pantheon_grant_inventory, for users with role x_1906124_pantheon.analyst.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'read',
    roles: ['x_1906124_pantheon.analyst'],
    table: 'x_1906124_pantheon_grant_inventory',
})
