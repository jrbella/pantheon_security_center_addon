import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['grant-class-calculator'],
    name: 'GrantClassCalculator',
    script: Now.include('./grant-class-calculator.server.js'),
    description:
        'Derives grant_inventory.grant_class from last_exercised against the debt.aging_days / debt.dormancy_days system properties: active below the aging threshold, aging between the two thresholds, dormant at or past the dormancy threshold. Kept separate from UsageSignalBuilder because this is a pure computation over existing data (Calculator), not a record-materializing step (Builder) -- it can be re-run on its own whenever last_exercised changes for real, without dragging in the synthetic-seed generator. Depends on last_exercised already being populated.',
    apiName: 'x_1906124_pantheon.GrantClassCalculator',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
