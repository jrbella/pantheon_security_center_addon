import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_1906124_pantheon_outlier_finding',
    view: default_view,
    columns: ['number', 'user', 'role', 'reason', 'peer_count', 'peer_group', 'computed_on', 'sys_updated_on'],
})
