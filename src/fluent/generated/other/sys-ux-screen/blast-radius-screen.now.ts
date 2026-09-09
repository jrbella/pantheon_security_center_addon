import { Record } from '@servicenow/sdk/core'
import { blastRadiusMacroponent } from '../sys-ux-macroponent/blast-radius-macroponent.now'
import { blastRadiusScreenType } from '../sys-ux-screen-type/blast-radius-screen-type.now'

Record({
    $id: Now.ID['blast-radius-screen'],
    table: 'sys_ux_screen',
    data: {
        active: true,
        app_config: '7cf5480793f6c390fca235018bba1037',
        disable_auto_reflow: false,
        disable_interoperable: false,
        event_mappings: '[]',
        macroponent: blastRadiusMacroponent,
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
    "propagateNotifications": {
        "type": "JSON_LITERAL",
        "value": false
    },
    "scrollable": {
        "type": "JSON_LITERAL",
        "value": "y"
    }
}`,
        name: 'Blast radius default',
        order: 1,
        parent_macroponent: 'c276387cc331101080d6d3658940ddd2',
        required_translations: '[ ]',
        screen_type: blastRadiusScreenType,
        sys_domain: 'global',
        sys_domain_path: '/',
    },
})
