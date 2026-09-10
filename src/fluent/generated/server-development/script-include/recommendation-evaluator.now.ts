import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['recommendation-evaluator'],
    name: 'RecommendationEvaluator',
    script: Now.include('./recommendation-evaluator.server.js'),
    description:
        'Pure computation over RecommendationCalculator output: simulateReduction(identitySysId) replays 180 days of usage_action_log against the proposed KEEP set and counts allowed vs blocked actions; getPilotMetrics(identitySysId) reports avg roles/user before-and-after (real, computed) alongside static acceptance-rate/rollback-rate placeholders (no apply-history exists yet to compute those from). Writes nothing to any table.',
    apiName: 'x_1906124_pantheon.RecommendationEvaluator',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
