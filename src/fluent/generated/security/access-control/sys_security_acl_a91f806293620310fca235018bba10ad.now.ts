import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['a91f806293620310fca235018bba10ad'],
    description:
        'Allow read for records in x_1906124_pantheon_outlier_finding, for users with role x_1906124_pantheon.admin.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'read',
    roles: ['x_1906124_pantheon.admin'],
    table: 'x_1906124_pantheon_outlier_finding',
})
