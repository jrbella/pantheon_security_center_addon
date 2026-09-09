import { Table, StringColumn, ChoiceColumn } from '@servicenow/sdk/core'

export const x_1906124_pantheon_sensitive_table_register = Table({
    actions: {
        read: true,
        update: true,
        delete: true,
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
        prefix: 'SEN',
    },
    index: [
        {
            name: 'index',
            unique: true,
            element: 'table_name',
        },
    ],
    label: 'sensitive_table_register',
    name: 'x_1906124_pantheon_sensitive_table_register',
    schema: {
        table_name: StringColumn({
            label: 'Table name',
            maxLength: 80,
            mandatory: true,
        }),
        sensitivity: ChoiceColumn({
            label: 'Sensitivity',
            choices: {
                low: {
                    label: 'low',
                    sequence: 0,
                },
                medium: {
                    label: 'medium',
                    sequence: 1,
                },
                high: {
                    label: 'high',
                    sequence: 2,
                },
            },
            dropdown: 'dropdown_without_none',
            maxLength: 40,
            mandatory: true,
        }),
        reason: StringColumn({
            label: 'Reason',
            maxLength: 255,
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
