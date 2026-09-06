// Sequence matters: the evaluator reads what the two builders produce.
// Running them together keeps the three generation stamps close, so
// findings are computed against inventory and peer groups from the
// same run rather than from different days.

var inventory = new GrantInventoryBuilder().build();
var peers     = new PeerGroupBuilder().build();
var outliers  = new OutlierEvaluator().build();

gs.info('PANTHEON | nightly run complete | ' +
        'grants=' + (inventory ? inventory.direct + inventory.group : 'FAILED') +
        ' peerGroups=' + (peers ? peers.groups : 'FAILED') +
        ' findings=' + (outliers ? outliers.findings : 'FAILED'));