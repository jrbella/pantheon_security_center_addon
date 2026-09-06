import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['99134c129326cf50fca235018bba10cb'],
    description:
        'Allow write for records in x_1906124_pantheon_peer_group, for users with role x_1906124_pantheon.admin.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'write',
    roles: ['x_1906124_pantheon.admin'],
    table: 'x_1906124_pantheon_peer_group',
})
