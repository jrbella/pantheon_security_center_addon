import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['ad2d530693ee8f50fca235018bba1035'],
    description:
        'Allow write for records in x_1906124_pantheon_grant_inventory, for users with role x_1906124_pantheon.user.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'write',
    roles: ['x_1906124_pantheon.user'],
    table: 'x_1906124_pantheon_grant_inventory',
})
