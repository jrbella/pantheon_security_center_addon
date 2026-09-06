import { Table, IntegerColumn, StringColumn, DateTimeColumn } from '@servicenow/sdk/core'

export const x_1906124_pantheon_peer_group = Table({
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
        prefix: 'PEE',
    },
    label: 'peer_group',
    name: 'x_1906124_pantheon_peer_group',
    schema: {
        member_count: IntegerColumn({
            label: 'Member count',
            maxLength: 40,
        }),
        group_key: StringColumn({
            label: 'Group key',
            maxLength: 40,
        }),
        computed_on: DateTimeColumn({
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
        label: StringColumn({
            maxLength: 40,
        }),
    },
})
