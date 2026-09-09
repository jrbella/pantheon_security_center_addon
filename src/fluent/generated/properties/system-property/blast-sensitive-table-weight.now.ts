import { Property } from '@servicenow/sdk/core'

Property({
    $id: Now.ID['blast-sensitive-table-weight'],
    name: 'x_1906124_pantheon.blast.sensitive_table_weight',
    value: '6',
    description:
        'Weight applied to sensitive_table_count (count of sensitive_table_register tables reachable via role ACL grants) when BlastRadiusEvaluator computes a blast radius score. See also blast.hop_weight and blast.impersonation_weight.',
    type: 'string',
    ignoreCache: true,
})
