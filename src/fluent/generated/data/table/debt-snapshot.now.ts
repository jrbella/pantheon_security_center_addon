import { Table, StringColumn, DecimalColumn, DateTimeColumn } from '@servicenow/sdk/core'

export const x_1906124_pantheon_debt_snapshot = Table({
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
        prefix: 'DBT',
    },
    label: 'debt_snapshot',
    name: 'x_1906124_pantheon_debt_snapshot',
    schema: {
        quarter: StringColumn({
            label: 'Quarter',
            maxLength: 40,
        }),
        score: DecimalColumn({
            label: 'Score',
            scale: 1,
            maxLength: 15,
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
    },
})
