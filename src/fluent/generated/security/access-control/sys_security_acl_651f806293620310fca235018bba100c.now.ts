import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['651f806293620310fca235018bba100c'],
    description:
        'Allow create for records in x_1906124_pantheon_outlier_finding, for users with role x_1906124_pantheon.user.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'create',
    roles: ['x_1906124_pantheon.user'],
    table: 'x_1906124_pantheon_outlier_finding',
})
