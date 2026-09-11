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
}, {
  "message" : "Blast radius",
  "code" : "",
  "comment" : ""
}, {
  "message" : "Blast Radius Graph",
  "code" : "",
  "comment" : ""
}, {
  "message" : "Recommendations",
  "code" : "",
  "comment" : ""
}, {
  "message" : "Peer Findings",
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
    },
    {
        "id": "blast-radius",
        "label": {
            "translatable": true,
            "message": "Blast radius"
        },
        "icon": "tree-flow-fill",
        "routeInfo": {
            "route": "blast-radius"
        },
        "group": "top",
        "order": 200,
        "badge": {},
        "presence": {},
        "availability": {},
        "viewportInfo": {}
    },
    {
        "id": "blast-radius-graph",
        "label": {
            "translatable": true,
            "message": "Blast Radius Graph"
        },
        "icon": "chart-dependency-fill",
        "routeInfo": {
            "route": "blast-radius-graph"
        },
        "group": "top",
        "order": 300,
        "badge": {},
        "presence": {},
        "availability": {},
        "viewportInfo": {}
    },
    {
        "id": "recommendations",
        "label": {
            "translatable": true,
            "message": "Recommendations"
        },
        "icon": "lightbulb-fill",
        "routeInfo": {
            "route": "recommendations"
        },
        "group": "top",
        "order": 400,
        "badge": {},
        "presence": {},
        "availability": {},
        "viewportInfo": {}
    },
    {
        "id": "peer-findings",
        "label": {
            "translatable": true,
            "message": "Peer Findings"
        },
        "icon": "user-group-fill",
        "routeInfo": {
            "route": "peer-findings"
        },
        "group": "top",
        "order": 500,
        "badge": {},
        "presence": {},
        "availability": {},
        "viewportInfo": {}
    }
]`,
    },
})
