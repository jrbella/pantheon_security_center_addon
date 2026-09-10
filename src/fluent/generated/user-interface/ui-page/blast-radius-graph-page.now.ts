import { UiPage } from '@servicenow/sdk/core'
import page from '../../../../client/index.html'

export const blastRadiusGraphPage = UiPage({
    $id: Now.ID['blast-radius-graph-page'],
    endpoint: 'x_1906124_pantheon_blast_radius_graph.do',
    description: 'React UI Page rendering the blast radius reachability graph for one identity',
    html: page,
    direct: true,
})
