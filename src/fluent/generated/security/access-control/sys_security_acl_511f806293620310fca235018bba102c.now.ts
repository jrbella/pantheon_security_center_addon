import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['511f806293620310fca235018bba102c'],
    description:
        'Allow read for records in x_1906124_pantheon_outlier_finding, for users with role x_1906124_pantheon.analyst.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'read',
    roles: ['x_1906124_pantheon.analyst'],
    table: 'x_1906124_pantheon_outlier_finding',
})
