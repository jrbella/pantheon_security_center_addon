import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['6c850c569326cf50fca235018bba10bb'],
    description:
        'Allow read for records in x_1906124_pantheon_peer_group_member, for users with role x_1906124_pantheon.analyst.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'read',
    roles: ['x_1906124_pantheon.analyst'],
    table: 'x_1906124_pantheon_peer_group_member',
})
