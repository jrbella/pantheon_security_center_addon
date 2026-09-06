import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['fd1fc06293620310fca235018bba1017'],
    description:
        'Allow read for records in x_1906124_pantheon_outlier_finding, for users with role x_1906124_pantheon.user.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'read',
    roles: ['x_1906124_pantheon.user'],
    table: 'x_1906124_pantheon_outlier_finding',
})
