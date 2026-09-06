import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['21138c129326cf50fca235018bba104c'],
    description:
        'Allow write for records in x_1906124_pantheon_peer_group, for users with role x_1906124_pantheon.user.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'write',
    roles: ['x_1906124_pantheon.user'],
    table: 'x_1906124_pantheon_peer_group',
})
