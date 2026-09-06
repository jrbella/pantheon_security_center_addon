import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['c5858c569326cf50fca235018bba1055'],
    description:
        'Allow delete for records in x_1906124_pantheon_peer_group_member, for users with role x_1906124_pantheon.admin.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'delete',
    roles: ['x_1906124_pantheon.admin'],
    table: 'x_1906124_pantheon_peer_group_member',
})
