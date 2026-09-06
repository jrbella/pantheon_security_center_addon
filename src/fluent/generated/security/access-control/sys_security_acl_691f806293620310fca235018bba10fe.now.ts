import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['691f806293620310fca235018bba10fe'],
    description:
        'Allow write for records in x_1906124_pantheon_outlier_finding, for users with role x_1906124_pantheon.admin.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'write',
    roles: ['x_1906124_pantheon.admin'],
    table: 'x_1906124_pantheon_outlier_finding',
})
