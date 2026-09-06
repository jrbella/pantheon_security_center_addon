import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['c198230e9322cf50fca235018bba1032'],
    name: 'GrantInventoryBuilder',
    script: Now.include('./sys_script_include_c198230e9322cf50fca235018bba1032.server.js'),
    description:
        'Materializes grant_inventory from platform sources. Reads direct role assignments from sys_user_has_role where inherited is false, and group-derived roles by joining sys_user_grmember to sys_group_has_role, walking group parent chains since nested groups propagate roles. Writes one row per user-role-source combination with source_record set to the group the user is actually a member of, not the ancestor that carries the role, so that revoke actions point at something actionable. Role containment is deliberately not expanded here; it is resolved on demand for explanation only, because containment produces identical expansions for every holder and therefore carries no peer-comparison signal. Truncates and rebuilds on each run. Called by the peer analysis scheduled job.',
    apiName: 'x_1906124_pantheon.GrantInventoryBuilder',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
