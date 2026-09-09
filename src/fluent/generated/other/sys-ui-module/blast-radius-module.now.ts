import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['blast-radius-module'],
    table: 'sys_ui_module',
    data: {
        active: true,
        application: '9b2587d793a6c710fca235018bba10d5',
        name: 'Blast radius',
        order: 200,
        path_relative_to_root: false,
        roles: ['x_1906124_pantheon.reader'],
        sys_domain: 'global',
        sys_domain_path: '/',
        table: 'x_1906124_pantheon_blast_radius_finding',
        uncancelable: false,
    },
})
