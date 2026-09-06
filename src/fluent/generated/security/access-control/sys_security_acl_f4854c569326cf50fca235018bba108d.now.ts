import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['f4854c569326cf50fca235018bba108d'],
    description:
        'Allow read for records in x_1906124_pantheon_peer_group_member, for users with role x_1906124_pantheon.admin.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'read',
    roles: ['x_1906124_pantheon.admin'],
    table: 'x_1906124_pantheon_peer_group_member',
})
