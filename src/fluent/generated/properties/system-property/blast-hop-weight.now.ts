import { Property } from '@servicenow/sdk/core'

Property({
    $id: Now.ID['blast-hop-weight'],
    name: 'x_1906124_pantheon.blast.hop_weight',
    value: '8',
    description:
        'Weight applied to hop_count (role-containment depth to the deepest reachable sensitive table) when BlastRadiusEvaluator computes a blast radius score. See also blast.sensitive_table_weight and blast.impersonation_weight.',
    type: 'string',
    ignoreCache: true,
})
