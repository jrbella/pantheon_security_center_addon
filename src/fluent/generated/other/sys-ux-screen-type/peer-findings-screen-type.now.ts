import { Record } from '@servicenow/sdk/core'

export const peerFindingsScreenType = Record({
    $id: Now.ID['peer-findings-screen-type'],
    table: 'sys_ux_screen_type',
    data: {
        name: 'Peer Findings',
    },
})
