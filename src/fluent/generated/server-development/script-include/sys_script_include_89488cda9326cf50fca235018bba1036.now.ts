import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['89488cda9326cf50fca235018bba1036'],
    name: 'PeerGroupBuilder',
    script: Now.include('./sys_script_include_89488cda9326cf50fca235018bba1036.server.js'),
    description:
        'Materializes peer_group and peer_group_member from user attributes. Clusters users by the attributes named in the clustering property, defaulting to department. Users with no value for a clustering attribute are excluded, since a group of users with nothing in common is not a peer group; this notably excludes service and integration accounts, which is a known gap. Generational rebuild stamped with computed_on, matching GrantInventoryBuilder. Groups below the minimum size property produce no records, because a peer comparison against a handful of people is not evidence. Called by the peer analysis scheduled job.',
    apiName: 'x_1906124_pantheon.PeerGroupBuilder',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
