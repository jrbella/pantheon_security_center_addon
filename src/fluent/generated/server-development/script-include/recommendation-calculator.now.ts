import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['recommendation-calculator'],
    name: 'RecommendationCalculator',
    script: Now.include('./recommendation-calculator.server.js'),
    description:
        'Pure computation of a KEEP/REMOVE recommendation per role an identity currently holds (from grant_inventory), based on how many usage_action_log rows require that role within the rec.usage_window_days window. Threshold is x_1906124_pantheon.rec.min_actions_to_keep (default 1). Writes nothing to any table -- the caller (RecommendationBuilder) decides what to persist.',
    apiName: 'x_1906124_pantheon.RecommendationCalculator',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
