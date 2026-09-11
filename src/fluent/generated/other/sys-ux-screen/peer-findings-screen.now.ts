import { Record } from '@servicenow/sdk/core'
import { peerFindingsScreenType } from '../sys-ux-screen-type/peer-findings-screen-type.now'

Record({
    $id: Now.ID['peer-findings-screen'],
    table: 'sys_ux_screen',
    data: {
        active: true,
        app_config: '7cf5480793f6c390fca235018bba1037',
        disable_auto_reflow: false,
        disable_interoperable: false,
        event_mappings: '[]',
        macroponent: '4cae00c4eb750110d05213b3475228e5',
        // height is a fixed px workaround, not a true fluid fill: the now-iframe primitive
        // accepts CSS units incl. percentages, but the wrapping "iFrame Element" macroponent's
        // flex layout has no explicit height on its container, so height:"100%" collapses to
        // the iframe's intrinsic default (confirmed live: content was cut off after ~1 card).
        macroponent_config: `{
    "bare": {
        "type": "JSON_LITERAL",
        "value": true
    },
    "headerLevel": {
        "type": "JSON_LITERAL",
        "value": "1"
    },
    "headingOnlyVisibleToScreenReaders": {
        "type": "JSON_LITERAL",
        "value": false
    },
    "interceptNotifications": {
        "type": "JSON_LITERAL",
        "value": false
    },
    "label": {
        "type": "JSON_LITERAL",
        "value": ""
    },
    "payload": {
        "type": "JSON_LITERAL",
        "value": {
            "props_details": {
                "propstitle": "Peer Findings",
                "source": "/x_1906124_pantheon_peer_findings.do",
                "width": "100%",
                "height": "1400px",
                "disableSandbox": true
            }
        }
    },
    "propagateNotifications": {
        "type": "JSON_LITERAL",
        "value": false
    },
    "scrollable": {
        "type": "JSON_LITERAL",
        "value": "y"
    }
}`,
        name: 'Peer Findings default',
        order: 4,
        parent_macroponent: 'c276387cc331101080d6d3658940ddd2',
        required_translations: '[ ]',
        screen_type: peerFindingsScreenType,
        sys_domain: 'global',
        sys_domain_path: '/',
    },
})
