import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['seed-sensitive-table-register'],
    table: 'sys_script_fix',
    data: {
        before: false,
        description:
            'One-time seed of sensitive_table_register with 7 plausible sensitive tables for this PDI, spanning PII (sys_user), credential/OAuth storage (discovery_credentials, oauth_credential, sys_user_public_credential, sys_certificate), and admin config/financial (sys_properties, fm_expense_line). Chosen by inspecting this instance\'s actual sys_db_object list -- no HR module (hr_profile-style tables) or dedicated payment module was installed, so sys_user stands in for PII and fm_expense_line (Cost Management) for financial data. Not idempotent -- re-running will fail on the unique table_name index for every row already seeded.',
        name: 'Seed sensitive table register',
        record_for_rollback: true,
        script: `var rows = [
    { table_name: 'sys_user', sensitivity: 'medium', reason: 'PII: name, email, phone, and other personal details for every platform user' },
    { table_name: 'discovery_credentials', sensitivity: 'high', reason: 'Stored credentials used for MID Server discovery of external systems' },
    { table_name: 'oauth_credential', sensitivity: 'high', reason: 'OAuth client secret storage for inbound/outbound integrations' },
    { table_name: 'sys_user_public_credential', sensitivity: 'high', reason: 'Per-user API keys and public credential material' },
    { table_name: 'sys_certificate', sensitivity: 'high', reason: 'X.509 certificates and associated private key material' },
    { table_name: 'sys_properties', sensitivity: 'medium', reason: 'System configuration; property values can embed secrets such as API keys or connection strings' },
    { table_name: 'fm_expense_line', sensitivity: 'medium', reason: 'Financial expense line data (Cost Management)' }
];
var inserted = 0;
for (var i = 0; i < rows.length; i++) {
    var gr = new GlideRecord('x_1906124_pantheon_sensitive_table_register');
    gr.initialize();
    gr.setWorkflow(false);
    gr.setValue('table_name', rows[i].table_name);
    gr.setValue('sensitivity', rows[i].sensitivity);
    gr.setValue('reason', rows[i].reason);
    if (gr.insert()) {
        inserted++;
    }
}
gs.info('PANTHEON | seeded sensitive_table_register | inserted=' + inserted + ' of ' + rows.length);`,
        sys_name: 'Seed sensitive table register',
        unloadable: false,
    },
})
