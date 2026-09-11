import { Record } from '@servicenow/sdk/core'
import { blastRadiusGraphScreenType } from '../sys-ux-screen-type/blast-radius-graph-screen-type.now'

Record({
    $id: Now.ID['blast-radius-graph-app-route'],
    table: 'sys_ux_app_route',
    data: {
        app_config: '7cf5480793f6c390fca235018bba1037',
        interoperable: false,
        name: 'Blast Radius Graph',
        order: 2,
        parent_macroponent: 'c276387cc331101080d6d3658940ddd2',
        route_type: 'blast-radius-graph',
        screen_type: blastRadiusGraphScreenType,
    },
})
