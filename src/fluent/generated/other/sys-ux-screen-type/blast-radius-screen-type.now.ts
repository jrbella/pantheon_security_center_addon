import { Record } from '@servicenow/sdk/core'

export const blastRadiusScreenType = Record({
    $id: Now.ID['blast-radius-screen-type'],
    table: 'sys_ux_screen_type',
    data: {
        name: 'Blast radius',
    },
})
