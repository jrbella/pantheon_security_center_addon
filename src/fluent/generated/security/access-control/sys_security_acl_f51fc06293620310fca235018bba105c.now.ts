import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['f51fc06293620310fca235018bba105c'],
    description:
        'Allow write for records in x_1906124_pantheon_outlier_finding, for users with role x_1906124_pantheon.user.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'write',
    roles: ['x_1906124_pantheon.user'],
    table: 'x_1906124_pantheon_outlier_finding',
})
