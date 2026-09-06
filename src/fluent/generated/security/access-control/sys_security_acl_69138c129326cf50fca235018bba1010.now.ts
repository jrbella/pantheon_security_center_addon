import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['69138c129326cf50fca235018bba1010'],
    description:
        'Allow delete for records in x_1906124_pantheon_peer_group, for users with role x_1906124_pantheon.admin.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'delete',
    roles: ['x_1906124_pantheon.admin'],
    table: 'x_1906124_pantheon_peer_group',
})
