import { Property } from '@servicenow/sdk/core'

Property({
    $id: Now.ID['rec-min-actions-to-keep'],
    name: 'x_1906124_pantheon.rec.min_actions_to_keep',
    value: '1',
    description:
        'Minimum count of usage_action_log rows (within rec.usage_window_days) a currently-held role must have for RecommendationCalculator to recommend KEEP instead of REMOVE.',
    type: 'integer',
    ignoreCache: true,
})
