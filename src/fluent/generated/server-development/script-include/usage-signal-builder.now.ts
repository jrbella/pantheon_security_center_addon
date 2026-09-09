import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['usage-signal-builder'],
    name: 'UsageSignalBuilder',
    script: Now.include('./usage-signal-builder.server.js'),
    description:
        'One-time synthetic seed for grant_inventory.last_exercised. Stamps every row with a weighted-random date so the dormant-grants view has realistic-looking data to demo against: ~55-60% land 0-30 days ago (active), ~20-25% land 31-90 days ago (aging), and ~15-20% land 91+ days ago (dormant), with a handful of the dormant picks pushed past 350 days to give the dormant list real outliers. Run once via a Fix Script, not on the nightly schedule -- re-randomizing nightly would break demo continuity. Not seeded; a resettable demo variant would be a separate script.',
    apiName: 'x_1906124_pantheon.UsageSignalBuilder',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
