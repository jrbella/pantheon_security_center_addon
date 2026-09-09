import { Table, StringColumn, ChoiceColumn, DecimalColumn, IntegerColumn, DateTimeColumn } from '@servicenow/sdk/core'

export const x_1906124_pantheon_blast_radius_finding = Table({
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
        prefix: 'BLR',
    },
    index: [
        {
            name: 'index',
            unique: true,
            element: ['entity_type', 'entity_sys_id'],
        },
        {
            name: 'index2',
            unique: false,
            element: 'score',
        },
    ],
    label: 'blast_radius_finding',
    name: 'x_1906124_pantheon_blast_radius_finding',
    schema: {
        entity_type: ChoiceColumn({
            label: 'Entity type',
            choices: {
                user: {
                    label: 'user',
                    sequence: 0,
                },
                group: {
                    label: 'group',
                    sequence: 1,
                },
            },
            dropdown: 'dropdown_without_none',
            maxLength: 40,
            mandatory: true,
        }),
        entity_sys_id: StringColumn({
            label: 'Entity sys_id',
            maxLength: 32,
            mandatory: true,
        }),
        entity_name: StringColumn({
            label: 'Entity name',
            maxLength: 100,
        }),
        score: DecimalColumn({
            label: 'Score',
            scale: 1,
            maxLength: 15,
        }),
        hop_count: IntegerColumn({
            label: 'Hop count',
        }),
        sensitive_table_count: IntegerColumn({
            label: 'Sensitive table count',
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
