import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['d52d130693ee8f50fca235018bba10e6'],
    description:
        'Allow write for records in x_1906124_pantheon_grant_inventory, for users with role x_1906124_pantheon.admin.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'write',
    roles: ['x_1906124_pantheon.admin'],
    table: 'x_1906124_pantheon_grant_inventory',
})
