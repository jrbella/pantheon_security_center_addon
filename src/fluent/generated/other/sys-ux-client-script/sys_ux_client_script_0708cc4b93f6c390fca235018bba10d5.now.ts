import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['0708cc4b93f6c390fca235018bba10d5'],
    table: 'sys_ux_client_script',
    data: {
        macroponent: '2608cc4b93f6c390fca235018bba105a',
        name: 'Set browser or workspace tab title',
        required_translations: '[]',
        script: `/**
* @param {params} params
* @param {api} params.api
* @param {any} params.event
* @param {any} params.imports
* @param {ApiHelpers} params.helpers
*/
function handler({api, event, helpers, imports}) {
    // set browser and workspace tab title
    if (!event.payload.title) {
        console.warn('ignoring request to set empty tab title');
        return;
    }
    api.emit('SCREEN_STATUS_CHANGED', { title: event.payload.title });
}`,
        script_api_version: '2.0.0',
        sys_name: 'Set browser or workspace tab title',
        target: 'macroponent',
        type: 'default',
    },
})
