import { Record } from '@servicenow/sdk/core'
import { recommendationsScreenType } from '../sys-ux-screen-type/recommendations-screen-type.now'

Record({
    $id: Now.ID['recommendations-app-route'],
    table: 'sys_ux_app_route',
    data: {
        app_config: '7cf5480793f6c390fca235018bba1037',
        interoperable: false,
        name: 'Recommendations',
        order: 3,
        parent_macroponent: 'c276387cc331101080d6d3658940ddd2',
        route_type: 'recommendations',
        screen_type: recommendationsScreenType,
    },
})
