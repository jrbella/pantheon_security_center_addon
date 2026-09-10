import { Property } from '@servicenow/sdk/core'

Property({
    $id: Now.ID['rec-usage-window-days'],
    name: 'x_1906124_pantheon.rec.usage_window_days',
    value: '180',
    description:
        'Lookback window, in days, that RecommendationCalculator and RecommendationEvaluator scan usage_action_log over when counting role usage and simulating a reduced role set.',
    type: 'integer',
    ignoreCache: true,
})
