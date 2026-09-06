import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['4a7c48c3933ac390fca235018bba10b3'],
    table: 'sys_ux_page_property',
    data: {
        name: 'chrome_toolbar',
        page: '61f5480793f6c390fca235018bba103e',
        required_translations: `[ {
  "message" : "Findings",
  "code" : "",
  "comment" : ""
} ]`,
        sys_domain: 'global',
        sys_domain_path: 'global',
        type: 'json',
        unique_name: 'x_1906124_pantheon.61f5480793f6c390fca235018bba103e.root.global.chrome_toolbar',
        value: `[
    {
        "id": "findings",
        "label": {
            "translatable": true,
            "message": "Findings"
        },
        "icon": "shield-check-fill",
        "routeInfo": {
            "route": "findings"
        },
        "group": "top",
        "order": 100,
        "badge": {},
        "presence": {},
        "availability": {},
        "viewportInfo": {}
    }
]`,
    },
})
