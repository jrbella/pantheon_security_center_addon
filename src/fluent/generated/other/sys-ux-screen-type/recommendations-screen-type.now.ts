import { Record } from '@servicenow/sdk/core'

export const recommendationsScreenType = Record({
    $id: Now.ID['recommendations-screen-type'],
    table: 'sys_ux_screen_type',
    data: {
        name: 'Recommendations',
    },
})
