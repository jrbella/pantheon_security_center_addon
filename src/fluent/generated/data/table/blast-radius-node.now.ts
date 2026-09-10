import { Table, ReferenceColumn, StringColumn, ChoiceColumn, IntegerColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_1906124_pantheon_blast_radius_node = Table({
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
        prefix: 'BRN',
    },
    index: [
        {
            name: 'index',
            unique: false,
            element: 'finding',
        },
    ],
    label: 'blast_radius_node',
    name: 'x_1906124_pantheon_blast_radius_node',
    schema: {
        finding: ReferenceColumn({
            label: 'Finding',
            maxLength: 32,
            referenceTable: 'x_1906124_pantheon_blast_radius_finding',
            mandatory: true,
        }),
        label: StringColumn({
            label: 'Label',
            maxLength: 100,
            mandatory: true,
        }),
        category: ChoiceColumn({
            label: 'Category',
            choices: {
                role: {
                    label: 'role',
                    sequence: 0,
                },
                table: {
                    label: 'table',
                    sequence: 1,
                },
            },
            dropdown: 'dropdown_without_none',
            maxLength: 40,
            mandatory: true,
        }),
        hop_distance: IntegerColumn({
            label: 'Hop distance',
        }),
        is_sensitive: BooleanColumn({
            label: 'Is sensitive',
        }),
        record_sys_id: StringColumn({
            label: 'Record sys_id',
            maxLength: 32,
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
