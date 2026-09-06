import { ScheduledScript } from '@servicenow/sdk/core'

ScheduledScript({
    $id: Now.ID['2e4f33b693b6c390fca235018bba10eb'],
    name: 'Peer: rebuild access analysis (nightly)',
    runAs: '6816f79cc0a8016401c5a33be04be441',
    frequency: 'daily',
    dayOfWeek: 'monday',
    dayOfMonth: 1,
    weekInMonth: 1,
    month: 1,
    executionTime: Time(
        {
            hours: 9,
            minutes: 0,
        },
        'US/Central'
    ),
    timeZone: 'US/Central',
    script: Now.include('./sysauto_script_2e4f33b693b6c390fca235018bba10eb.js'),
})
