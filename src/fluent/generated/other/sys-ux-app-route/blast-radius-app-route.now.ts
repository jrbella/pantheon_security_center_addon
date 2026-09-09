import { Record } from '@servicenow/sdk/core'
import { blastRadiusScreenType } from '../sys-ux-screen-type/blast-radius-screen-type.now'

Record({
    $id: Now.ID['blast-radius-app-route'],
    table: 'sys_ux_app_route',
    data: {
        app_config: '7cf5480793f6c390fca235018bba1037',
        interoperable: false,
        name: 'Blast radius',
        order: 1,
        parent_macroponent: 'c276387cc331101080d6d3658940ddd2',
        route_type: 'blast-radius',
        screen_type: blastRadiusScreenType,
    },
})
