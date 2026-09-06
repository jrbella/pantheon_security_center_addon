import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['55134c129326cf50fca235018bba107a'],
    description:
        'Allow read for records in x_1906124_pantheon_peer_group, for users with role x_1906124_pantheon.admin.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'read',
    roles: ['x_1906124_pantheon.admin'],
    table: 'x_1906124_pantheon_peer_group',
})
