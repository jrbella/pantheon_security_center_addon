import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['9d1f806293620310fca235018bba1022'],
    description:
        'Allow create for records in x_1906124_pantheon_outlier_finding, for users with role x_1906124_pantheon.admin.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'create',
    roles: ['x_1906124_pantheon.admin'],
    table: 'x_1906124_pantheon_outlier_finding',
})
