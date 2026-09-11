import { Record } from '@servicenow/sdk/core'

export const blastRadiusGraphScreenType = Record({
    $id: Now.ID['blast-radius-graph-screen-type'],
    table: 'sys_ux_screen_type',
    data: {
        name: 'Blast Radius Graph',
    },
})
