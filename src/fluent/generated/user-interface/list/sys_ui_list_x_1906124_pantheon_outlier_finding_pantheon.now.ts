import { List } from '@servicenow/sdk/core'

List({
    table: 'x_1906124_pantheon_outlier_finding',
    view: 'pantheon',
    columns: ['user', 'role', 'reason', 'peer_count', 'peer_group', 'computed_on'],
})
