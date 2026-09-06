import { Table, ChoiceColumn, BooleanColumn, StringColumn, ReferenceColumn, DateTimeColumn } from '@servicenow/sdk/core'

export const x_1906124_pantheon_grant_inventory = Table({
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
        prefix: 'GRA',
    },
    index: [
        {
            name: 'index',
            unique: false,
            element: 'granting_group',
        },
        {
            name: 'index2',
            unique: false,
            element: 'role',
        },
        {
            name: 'index3',
            unique: false,
            element: ['user', 'role'],
        },
    ],
    label: 'grant_inventory',
    name: 'x_1906124_pantheon_grant_inventory',
    schema: {
        source_type: ChoiceColumn({
            choices: {
                containment: {
                    label: 'containment',
                    sequence: 2,
                },
                direct: {
                    label: 'direct',
                    sequence: 0,
                },
                group: {
                    label: 'group',
                    sequence: 1,
                },
            },
            dropdown: 'dropdown_without_none',
            maxLength: 40,
        }),
        is_inherited: BooleanColumn({
            label: 'Is inherited',
            maxLength: 40,
        }),
        number: StringColumn({
            attributes: {
                edge_encryption_enabled: true,
            },
            default: 'javascript:global.getNextObjNumberPadded();',
            maxLength: 40,
        }),
        role: ReferenceColumn({
            label: 'role',
            maxLength: 32,
            referenceTable: 'sys_user_has_role',
        }),
        granting_group: ReferenceColumn({
            label: 'Granting group',
            maxLength: 32,
            referenceTable: 'sys_user_group',
        }),
        source_record: StringColumn({
            maxLength: 40,
        }),
        user: ReferenceColumn({
            label: 'user',
            maxLength: 32,
            referenceTable: 'sys_user',
        }),
        computed_on: DateTimeColumn({
            maxLength: 40,
        }),
    },
})
