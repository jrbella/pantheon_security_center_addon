import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['run-blast-radius-verification'],
    table: 'sys_script_fix',
    data: {
        before: false,
        description:
            'End-to-end verification of BlastRadiusEvaluator + BlastRadiusFindingBuilder against 5 real identities/groups on this PDI: admin (System Administrator, expected high), svc.desk (Service Desk, single narrow role, expected low), two itil-class users (chuck.tomasi, bushra.akhtar), and the Change Management group (2 members, change_manager role). Writes one blast_radius_finding row per entity and logs entity/score/hopCount/sensitiveTableCount/impersonation to the system log for review. Not idempotent in the sense of accumulating history -- BlastRadiusFindingBuilder upserts, so re-running recomputes and replaces these 5 rows in place.',
        name: 'Run blast radius verification',
        record_for_rollback: true,
        script: `var entities = [
    { type: 'user', id: '6816f79cc0a8016401c5a33be04be441', label: 'admin (System Administrator)' },
    { type: 'user', id: '413a4d35eb32010045e1a5115206fe6b', label: 'svc.desk (Service Desk)' },
    { type: 'user', id: 'b9377c460b0131109dae8a8db777b295', label: 'chuck.tomasi' },
    { type: 'user', id: '506c0f9cd7011200f2d224837e61030f', label: 'bushra.akhtar' },
    { type: 'group', id: 'a715cd759f2002002920bde8132e7018', label: 'Change Management (group)' }
];
var builder = new BlastRadiusFindingBuilder();
for (var i = 0; i < entities.length; i++) {
    var e = entities[i];
    var result = builder.computeAndStore(e.type, e.id);
    gs.info('PANTHEON | BlastRadius verify | ' + e.label +
            ' | type=' + result.entityType +
            ' score=' + result.score +
            ' hopCount=' + result.hopCount +
            ' sensitiveTables=' + result.sensitiveTableCount +
            ' impersonation=' + result.hasImpersonationEntitlement +
            (result.memberCount !== null ? ' memberCount=' + result.memberCount : ''));
}`,
        sys_name: 'Run blast radius verification',
        unloadable: false,
    },
})
