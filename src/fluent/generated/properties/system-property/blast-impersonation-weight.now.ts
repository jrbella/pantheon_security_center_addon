import { Property } from '@servicenow/sdk/core'

Property({
    $id: Now.ID['blast-impersonation-weight'],
    name: 'x_1906124_pantheon.blast.impersonation_weight',
    value: '15',
    description:
        'Flat weight added when the reachable role set (direct or via role containment) includes the impersonator role, applied when BlastRadiusEvaluator computes a blast radius score. See also blast.hop_weight and blast.sensitive_table_weight.',
    type: 'string',
    ignoreCache: true,
})
