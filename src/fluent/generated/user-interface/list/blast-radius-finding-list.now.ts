import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_1906124_pantheon_blast_radius_finding',
    view: default_view,
    columns: ['number', 'entity_type', 'entity_sys_id', 'entity_name', 'score', 'sensitive_table_count', 'computed_on', 'sys_updated_on'],
})

List({
    table: 'x_1906124_pantheon_blast_radius_finding',
    view: 'pantheon',
    columns: ['entity_name', 'entity_type', 'score', 'sensitive_table_count', 'computed_on'],
})
