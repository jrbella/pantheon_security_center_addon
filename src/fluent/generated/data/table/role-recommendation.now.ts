import {
    Table,
    ReferenceColumn,
    IntegerColumn,
    ChoiceColumn,
    StringColumn,
    DateTimeColumn,
} from '@servicenow/sdk/core'

export const x_1906124_pantheon_role_recommendation = Table({
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
        prefix: 'RRC',
    },
    index: [
        {
            name: 'index',
            unique: false,
            element: 'identity',
        },
        {
            name: 'index2',
            unique: false,
            element: 'role',
        },
    ],
    label: 'role_recommendation',
    name: 'x_1906124_pantheon_role_recommendation',
    schema: {
        identity: ReferenceColumn({
            label: 'Identity',
            maxLength: 32,
            referenceTable: 'sys_user',
            mandatory: true,
        }),
        role: ReferenceColumn({
            label: 'Role',
            maxLength: 32,
            referenceTable: 'sys_user_role',
            mandatory: true,
        }),
        current_usage_count: IntegerColumn({
            label: 'Current usage count',
        }),
        recommendation: ChoiceColumn({
            label: 'Recommendation',
            choices: {
                keep: {
                    label: 'Keep',
                    sequence: 0,
                },
                remove: {
                    label: 'Remove',
                    sequence: 1,
                },
            },
            dropdown: 'dropdown_without_none',
            maxLength: 40,
            mandatory: true,
        }),
        disposition: ChoiceColumn({
            label: 'Disposition',
            choices: {
                pending: {
                    label: 'Pending',
                    sequence: 0,
                },
                applied: {
                    label: 'Applied',
                    sequence: 1,
                },
                rejected: {
                    label: 'Rejected',
                    sequence: 2,
                },
            },
            default: 'pending',
            dropdown: 'dropdown_without_none',
            maxLength: 40,
            mandatory: true,
        }),
        justification: StringColumn({
            label: 'Justification',
            maxLength: 4000,
        }),
        reviewed_by: ReferenceColumn({
            label: 'Reviewed by',
            maxLength: 32,
            referenceTable: 'sys_user',
        }),
        reviewed_on: DateTimeColumn({
            label: 'Reviewed on',
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
