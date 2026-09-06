import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['05d5338693a2cf50fca235018bba104f'],
    table: 'sys_script_fix',
    data: {
        before: false,
        description: 'Test the functionality of the GrantInventory build method',
        name: 'GrantInventoryBuilderBuildTester',
        record_for_rollback: true,
        script: 'new GrantInventoryBuilder().build();',
        sys_name: 'GrantInventoryBuilderBuildTester',
        unloadable: false,
    },
})
