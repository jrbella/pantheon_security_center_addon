import { UiPage } from '@servicenow/sdk/core'
import page from '../../../../client/peer-findings.html'

export const peerFindingsPage = UiPage({
    $id: Now.ID['peer-findings-page'],
    endpoint: 'x_1906124_pantheon_peer_findings.do',
    description: 'React UI Page for Peer-Group Anomaly Detection: department-based peer group clusters with outlier members visually distinct, hover detail, and click-through to the underlying outlier_finding record',
    html: page,
    direct: true,
})
