import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_1906124_pantheon_blast_radius_node',
    view: default_view,
    columns: ['number', 'finding', 'label', 'category', 'hop_distance', 'is_sensitive'],
})

List({
    table: 'x_1906124_pantheon_blast_radius_node',
    view: 'pantheon',
    columns: ['label', 'category', 'hop_distance', 'is_sensitive'],
})
