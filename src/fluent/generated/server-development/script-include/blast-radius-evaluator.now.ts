import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['blast-radius-evaluator'],
    name: 'BlastRadiusEvaluator',
    script: Now.include('./blast-radius-evaluator.server.js'),
    description:
        'Pure computation of blast radius for a user or group. calculateBlastRadius(entityType, entitySysId) starts from grant_inventory rows (direct for a user, unioned across sys_user_grmember members for a group), expands transitively through sys_user_role_contains, and cross-references the reachable role set against sensitive_table_register via sys_security_acl_role/sys_security_acl to count reachable sensitive tables and the containment depth of the deepest one. The platform admin role bypasses table ACLs at runtime, so a reachable admin role is special-cased to reach every registered sensitive table rather than only the ones with explicit ACL role rows. calculateBlastRadiusScore(traversalResult) is a separate pure function over calculateBlastRadius output -- weights are read from blast.hop_weight / blast.sensitive_table_weight / blast.impersonation_weight. Writes nothing to any table; BlastRadiusFindingBuilder decides what to do with the result.',
    apiName: 'x_1906124_pantheon.BlastRadiusEvaluator',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
