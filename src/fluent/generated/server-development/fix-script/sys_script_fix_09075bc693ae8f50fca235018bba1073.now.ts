import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['09075bc693ae8f50fca235018bba1073'],
    table: 'sys_script_fix',
    data: {
        before: false,
        description:
            'Phase 0 diagnostic. Confirms the Pantheon scope can read the Security Center and core platform tables that grant inventory will be sourced from. Logs canRead, row count, and any exception per table, prefixed PANTHEON in the system log. Compare row counts against the same tables queried as admin in the platform UI; a count of zero against a populated table indicates an ACL condition rather than a scope block. Diagnostic only, writes nothing. Safe to delete once the answer is recorded in the decision log.',
        name: 'Verify cross-scope source read access',
        record_for_rollback: true,
        script: `var tables = [
  // Security Center tables — replace with the real names you found
  '/sn_vsc_security_task',

  // Core platform tables your grant inventory will actually need
  'sys_user_role',          // role definitions
  'sys_user_has_role',      // user to role, direct and inherited
  'sys_user_grmember',      // user to group
  'sys_group_has_role',     // group to role
  'sys_user_role_contains'  // role containment
];

tables.forEach(function (t) {
  try {
    var gr = new GlideRecord(t);

    if (!gr.isValid()) {
      gs.info('PANTHEON | ' + t + ' | INVALID or not reachable from this scope');
      return;
    }

    var readable = gr.canRead();
    gr.setLimit(1);
    gr.query();
    var sample = gr.next();

    var agg = new GlideAggregate(t);
    agg.addAggregate('COUNT');
    agg.query();
    var count = agg.next() ? agg.getAggregate('COUNT') : 'n/a';

    gs.info('PANTHEON | ' + t +
            ' | canRead=' + readable +
            ' | rows=' + count +
            ' | gotRow=' + sample);
  } catch (e) {
    gs.info('PANTHEON | ' + t + ' | EXCEPTION: ' + e.message);
  }
});`,
        sys_name: 'Verify cross-scope source read access',
        unloadable: false,
    },
})
