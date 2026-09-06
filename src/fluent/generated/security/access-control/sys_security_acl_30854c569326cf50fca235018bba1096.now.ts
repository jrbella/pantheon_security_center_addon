import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['30854c569326cf50fca235018bba1096'],
    description:
        'Allow read for records in x_1906124_pantheon_peer_group_member, for users with role x_1906124_pantheon.user.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'read',
    roles: ['x_1906124_pantheon.user'],
    table: 'x_1906124_pantheon_peer_group_member',
})
