import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['3f77fe9b9326c710fca235018bba10bd'],
    name: 'OutlierEvaluator',
    script: Now.include('./sys_script_include_3f77fe9b9326c710fca235018bba10bd.server.js'),
    description:
        "Evaluates each peer group's members agaisnt their peers grants and writes a finding for every grant held by few or no peers.",
    apiName: 'x_1906124_pantheon.OutlierEvaluator',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
