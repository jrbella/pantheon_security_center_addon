import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['8b1ac4de9326cf50fca235018bba10d9'],
    table: 'sys_script_fix',
    data: {
        before: false,
        description: "Test the script includes PeerGroupBuilder's build method",
        name: 'PeerGroupBuilderBuild Tester',
        record_for_rollback: true,
        script: 'new PeerGroupBuilder().build();',
        sys_name: 'PeerGroupBuilderBuild Tester',
        unloadable: false,
    },
})
