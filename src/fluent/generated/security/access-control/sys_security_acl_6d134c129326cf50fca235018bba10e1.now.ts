import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['6d134c129326cf50fca235018bba10e1'],
    description:
        'Allow read for records in x_1906124_pantheon_peer_group, for users with role x_1906124_pantheon.user.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'read',
    roles: ['x_1906124_pantheon.user'],
    table: 'x_1906124_pantheon_peer_group',
})
