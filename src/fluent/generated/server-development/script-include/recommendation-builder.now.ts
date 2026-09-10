import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['recommendation-builder'],
    name: 'RecommendationBuilder',
    script: Now.include('./recommendation-builder.server.js'),
    description:
        'Materializes RecommendationCalculator output into role_recommendation (upserts by identity+role, leaving any prior human review untouched on recompute), and handles the reviewer intent-capture actions: applyRecommendation() sets disposition=applied and opens a real sn_vsc_security_task with the justification; rejectRecommendation() sets disposition=rejected with no task.',
    apiName: 'x_1906124_pantheon.RecommendationBuilder',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
