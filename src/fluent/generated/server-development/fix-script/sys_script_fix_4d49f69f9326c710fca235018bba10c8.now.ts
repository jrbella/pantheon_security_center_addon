import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['4d49f69f9326c710fca235018bba10c8'],
    table: 'sys_script_fix',
    data: {
        before: false,
        description: 'Test the Script include OutlierEvaluator',
        name: 'OutlierEvaluatorBuild Tester',
        record_for_rollback: true,
        script: 'new OutlierEvaluator().build();',
        sys_name: 'OutlierEvaluatorBuild Tester',
        unloadable: false,
    },
})
