import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['blast-radius-finding-builder'],
    name: 'BlastRadiusFindingBuilder',
    script: Now.include('./blast-radius-finding-builder.server.js'),
    description:
        'Materializes blast_radius_finding and its blast_radius_node detail rows for one entity. computeAndStore(entityType, entitySysId) runs BlastRadiusEvaluator.calculateBlastRadius + calculateBlastRadiusScore, then upserts (delete-then-insert) that entity\'s finding row -- blast_radius_finding holds current state per entity for ranking, not a history like debt_snapshot. It then writes one blast_radius_node row per entry in the same traversal\'s reachableRoles (category role) and sensitiveTablesReached (category table, always is_sensitive=true), referencing the new finding -- this is additive persistence of detail the evaluator already computes, not a second calculation. Any node rows from a prior finding for this entity are purged first, since the finding sys_id changes on every upsert. Called per-entity today (verification Fix Script); a future scheduled job would call this in a loop across all identities/groups the same way GrantInventoryBuilder rebuilds grant_inventory.',
    apiName: 'x_1906124_pantheon.BlastRadiusFindingBuilder',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
