import {
    Table,
    ReferenceColumn,
    IntegerColumn,
    DateTimeColumn,
    StringColumn,
    BooleanColumn,
    ChoiceColumn,
} from '@servicenow/sdk/core'

export const x_1906124_pantheon_outlier_finding = Table({
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
        prefix: 'OUF',
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
            element: 'role',
        },
        {
            name: 'index3',
            unique: false,
            element: 'user',
        },
    ],
    label: 'outlier_finding',
    name: 'x_1906124_pantheon_outlier_finding',
    schema: {
        peer_group: ReferenceColumn({
            label: 'Peer group',
            maxLength: 32,
            referenceTable: 'x_1906124_pantheon_peer_group',
        }),
        group_size: IntegerColumn({
            label: 'Group size',
            maxLength: 40,
        }),
        computed_on: DateTimeColumn({
            label: 'Computed on',
            maxLength: 40,
        }),
        role: ReferenceColumn({
            maxLength: 32,
            referenceTable: 'sys_user_role',
        }),
        user: ReferenceColumn({
            maxLength: 32,
            referenceTable: 'sys_user',
        }),
        reason: StringColumn({
            maxLength: 255,
        }),
        is_current: BooleanColumn({
            label: 'IsCurrent',
            maxLength: 40,
        }),
        number: StringColumn({
            attributes: {
                edge_encryption_enabled: true,
            },
            default: 'javascript:global.getNextObjNumberPadded();',
            maxLength: 40,
        }),
               peer_count: IntegerColumn({
            label: 'Peer count',
            maxLength: 40,
        }),
        disposition: ChoiceColumn({
            label: 'Disposition',
            choices: {
                pending: { label: 'Pending' },
                revoked: { label: 'Revoked' },
                kept: { label: 'Kept' },
            },
            default: 'pending',
        }),
        reviewed_by: ReferenceColumn({
            label: 'Reviewed by',
            referenceTable: 'sys_user',
        }),
        reviewed_on: DateTimeColumn({
            label: 'Reviewed on',
        }),
        opened_on: DateTimeColumn({
            label: 'Opened on',
        }),
    },
})
