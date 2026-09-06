import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['ed2d530693ee8f50fca235018bba102a'],
    description:
        'Allow create for records in x_1906124_pantheon_grant_inventory, for users with role x_1906124_pantheon.admin.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'create',
    roles: ['x_1906124_pantheon.admin'],
    table: 'x_1906124_pantheon_grant_inventory',
})
