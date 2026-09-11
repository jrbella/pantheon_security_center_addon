import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['3af5044793f6c390fca235018bba10e8'],
    localOrExisting: 'Existing',
    type: 'ux_route',
    operation: 'read',
    roles: ['x_1906124_pantheon.reader'],
    name: 'now.pantheon.*',
})
