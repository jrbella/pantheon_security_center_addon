import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['cd858c569326cf50fca235018bba101c'],
    description:
        'Allow write for records in x_1906124_pantheon_peer_group_member, for users with role x_1906124_pantheon.admin.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'write',
    roles: ['x_1906124_pantheon.admin'],
    table: 'x_1906124_pantheon_peer_group_member',
})
