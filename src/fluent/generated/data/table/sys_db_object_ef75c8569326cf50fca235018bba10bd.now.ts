import { Table, StringColumn, ReferenceColumn } from '@servicenow/sdk/core'

export const x_1906124_pantheon_peer_group_member = Table({
    actions: {
        read: true,
        update: true,
        delete: false,
        create: true,
    },
    allowClientScripts: true,
    allowNewFields: true,
    allowUiActions: true,
    allowWebServiceAccess: true,
    attributes: {
        enforce_dot_walk_cross_scope_access: true,
    },
    autoNumber: {
        prefix: 'PEEM',
    },
    index: [
        {
            name: 'index',
            unique: false,
            element: 'peer_group',
        },
        {
            name: 'index2',
            unique: false,
            element: 'user',
        },
    ],
    label: 'peer_group_member',
    name: 'x_1906124_pantheon_peer_group_member',
    schema: {
        computed_on: StringColumn({
            label: 'Computed on',
            maxLength: 40,
        }),
        number: StringColumn({
            attributes: {
                edge_encryption_enabled: true,
            },
            default: 'javascript:global.getNextObjNumberPadded();',
            maxLength: 40,
        }),
        user: ReferenceColumn({
            maxLength: 32,
            referenceTable: 'sys_user',
        }),
        peer_group: ReferenceColumn({
            maxLength: 32,
            referenceTable: 'x_1906124_pantheon_peer_group',
        }),
    },
})
