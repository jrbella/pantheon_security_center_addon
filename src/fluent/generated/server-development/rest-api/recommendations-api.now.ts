import { RestApi } from '@servicenow/sdk/core'

RestApi({
    $id: Now.ID['recommendations-api'],
    name: 'Least-Privilege Recommendations API',
    serviceId: 'recommendations',
    shortDescription:
        'Backs the Least-Privilege Recommendations React UI page: recomputes and returns role recommendations + simulation + pilot metrics for one identity, and captures reviewer intent (apply/reject).',
    consumes: 'application/json',
    produces: 'application/json',
    routes: [
        {
            $id: Now.ID['recommendations-api-get-summary'],
            name: 'Get identity summary',
            path: '/identity/summary',
            method: 'GET',
            script: Now.include('./get-summary.server.js'),
        },
        {
            $id: Now.ID['recommendations-api-apply'],
            name: 'Apply recommendation',
            path: '/apply',
            method: 'POST',
            script: Now.include('./apply.server.js'),
        },
        {
            $id: Now.ID['recommendations-api-reject'],
            name: 'Reject recommendation',
            path: '/reject',
            method: 'POST',
            script: Now.include('./reject.server.js'),
        },
    ],
})
