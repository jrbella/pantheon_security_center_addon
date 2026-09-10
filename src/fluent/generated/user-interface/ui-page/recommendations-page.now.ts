import { UiPage } from '@servicenow/sdk/core'
import page from '../../../../client/recommendations.html'

export const recommendationsPage = UiPage({
    $id: Now.ID['recommendations-page'],
    endpoint: 'x_1906124_pantheon_recommendations.do',
    description: 'React UI Page for the Least-Privilege Recommendations module: role usage table, simulation panel, and apply/reject intent capture for one identity',
    html: page,
    direct: true,
})
