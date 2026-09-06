import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['492d130693ee8f50fca235018bba1076'],
    description:
        'Allow create for records in x_1906124_pantheon_grant_inventory, for users with role x_1906124_pantheon.user.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'create',
    roles: ['x_1906124_pantheon.user'],
    table: 'x_1906124_pantheon_grant_inventory',
})
