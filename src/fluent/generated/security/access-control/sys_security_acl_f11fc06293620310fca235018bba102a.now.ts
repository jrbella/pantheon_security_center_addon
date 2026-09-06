import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['f11fc06293620310fca235018bba102a'],
    description:
        'Allow delete for records in x_1906124_pantheon_outlier_finding, for users with role x_1906124_pantheon.admin.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'delete',
    roles: ['x_1906124_pantheon.admin'],
    table: 'x_1906124_pantheon_outlier_finding',
})
