import { Record } from '@servicenow/sdk/core'
import { peerFindingsScreenType } from '../sys-ux-screen-type/peer-findings-screen-type.now'

Record({
    $id: Now.ID['peer-findings-app-route'],
    table: 'sys_ux_app_route',
    data: {
        app_config: '7cf5480793f6c390fca235018bba1037',
        interoperable: false,
        name: 'Peer Findings',
        order: 4,
        parent_macroponent: 'c276387cc331101080d6d3658940ddd2',
        route_type: 'peer-findings',
        screen_type: peerFindingsScreenType,
    },
})
