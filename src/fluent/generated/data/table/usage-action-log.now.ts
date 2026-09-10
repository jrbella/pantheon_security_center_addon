import { Table, ReferenceColumn, StringColumn, DateTimeColumn } from '@servicenow/sdk/core'

export const x_1906124_pantheon_usage_action_log = Table({
    actions: {
        read: true,
        update: false,
        delete: false,
        create: false,
    },
    allowClientScripts: true,
    allowNewFields: true,
    allowUiActions: true,
    allowWebServiceAccess: true,
    attributes: {
        enforce_dot_walk_cross_scope_access: true,
    },
    autoNumber: {
        prefix: 'UAL',
    },
    index: [
        {
            name: 'index',
            unique: false,
            element: 'identity',
        },
    ],
    label: 'usage_action_log',
    name: 'x_1906124_pantheon_usage_action_log',
    schema: {
        identity: ReferenceColumn({
            label: 'Identity',
            maxLength: 32,
            referenceTable: 'sys_user',
            mandatory: true,
        }),
        role_required: StringColumn({
            label: 'Role required',
            maxLength: 80,
            mandatory: true,
        }),
        action_type: StringColumn({
            label: 'Action type',
            maxLength: 100,
            mandatory: true,
        }),
        occurred_on: DateTimeColumn({
            label: 'Occurred on',
            mandatory: true,
        }),
        number: StringColumn({
            attributes: {
                edge_encryption_enabled: true,
            },
            default: 'javascript:global.getNextObjNumberPadded();',
            maxLength: 40,
        }),
    },
})
