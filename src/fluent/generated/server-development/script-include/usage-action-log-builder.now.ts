import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['usage-action-log-builder'],
    name: 'UsageActionLogBuilder',
    script: Now.include('./usage-action-log-builder.server.js'),
    description:
        'Synthetic 180-day action log seed for the Least-Privilege Recommendations module. backfillActionLog(identitySysId) reads the identity\'s distinct currently-held roles from grant_inventory, purges that identity\'s existing usage_action_log rows, then logs a weighted volume of synthetic actions so a handful of roles (the KEEP set) carry the bulk of usage and the rest carry zero (the REMOVE set) -- mirroring the wireframe pattern of one or two dominant roles against a long tail of unused ones.',
    apiName: 'x_1906124_pantheon.UsageActionLogBuilder',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
