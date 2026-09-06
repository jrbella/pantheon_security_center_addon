import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['192d130693ee8f50fca235018bba10f1'],
    description:
        'Allow read for records in x_1906124_pantheon_grant_inventory, for users with role x_1906124_pantheon.user.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'read',
    roles: ['x_1906124_pantheon.user'],
    table: 'x_1906124_pantheon_grant_inventory',
})
