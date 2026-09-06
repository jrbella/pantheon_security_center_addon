import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['24850c569326cf50fca235018bba1058'],
    description:
        'Allow create for records in x_1906124_pantheon_peer_group_member, for users with role x_1906124_pantheon.user.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'create',
    roles: ['x_1906124_pantheon.user'],
    table: 'x_1906124_pantheon_peer_group_member',
})
