import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['412d130693ee8f50fca235018bba105f'],
    description:
        'Allow delete for records in x_1906124_pantheon_grant_inventory, for users with role x_1906124_pantheon.admin.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'delete',
    roles: ['x_1906124_pantheon.admin'],
    table: 'x_1906124_pantheon_grant_inventory',
})
