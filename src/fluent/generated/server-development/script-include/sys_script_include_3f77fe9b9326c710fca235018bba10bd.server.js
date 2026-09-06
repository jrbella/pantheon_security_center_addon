var OutlierEvaluator = Class.create();
OutlierEvaluator.prototype = {

    /**
     * Evaluates each peer group's members against their peers' grants
     * and writes a finding for every grant held by few or no peers.
     *
     * Reads the CURRENT GENERATION ONLY of grant_inventory, peer_group,
     * and peer_group_member (max computed_on per table — the builders
     * run at different times, so each table has its own stamp).
     *
     * Peer semantics: the subject is excluded from both sides of the
     * comparison. peer_count = holders of the role minus the subject;
     * group_size stored on the finding = members minus the subject.
     * Wireframe phrasing: "0 of 13 peers hold this role."
     *
     * Threshold: a finding is written when peer_count <= threshold.
     * Default 1: surfaces roles held by at most one peer. Note that a
     * role shared by exactly two group members produces one finding
     * for EACH of them (peer_count=1 both ways) — correct behavior,
     * not duplication.
     * NOTE (decision log): raw count for now. Known limitation — in a
     * 22-member group and a 173-member group the same peer_count is
     * very different evidence. Proportional threshold is the likely
     * customer-facing evolution, tuned together with min_group_size.
     *
     * Every finding names the peer group it was computed against —
     * mandatory under the overlap clustering model, where one user can
     * be an outlier in one group and normal in another.
     *
     * Generational rebuild stamped with computed_on, matching the
     * builders. CONSUMER CONTRACT: filter on is_current = true. The
     * flag is set on insert and cleared on the prior generation before
     * purge, so it survives a run that dies partway. Do not compute
     * max(computed_on) in list filters or data resources.
     *
     * Note the internal _currentGeneration reads still use max: they
     * read the source tables, which do not carry the flag.
     */
    initialize: function () {
        this.computedOn = new GlideDateTime();

        this.inventoryTable = 'x_1906124_pantheon_grant_inventory';
        this.groupTable     = 'x_1906124_pantheon_peer_group';
        this.memberTable    = 'x_1906124_pantheon_peer_group_member';
        this.findingTable   = 'x_1906124_pantheon_outlier_finding';

        var rawThreshold = gs.getProperty(
            'x_1906124_pantheon.peer.outlier_threshold', '1');
        this.threshold = parseInt(rawThreshold, 10);
        if (isNaN(this.threshold) || this.threshold < 0) {
            gs.warn('PANTHEON | outlier_threshold property unparseable (' +
                    rawThreshold + ') — defaulting to 1');
            this.threshold = 1;
        }
    },

    build: function () {
        var invGen   = this._currentGeneration(this.inventoryTable);
        var groupGen = this._currentGeneration(this.groupTable);
        if (!invGen || !groupGen) {
            gs.error('PANTHEON | outlier eval aborted — empty source table ' +
                     '(inventory gen=' + invGen + ', group gen=' + groupGen + ')');
            return null;
        }

        var findings = 0;
        var groupsEvaluated = 0;

        var group = new GlideRecord(this.groupTable);
        group.addQuery('computed_on', groupGen);
        group.query();

        while (group.next()) {
            findings += this._evaluateGroup(
                group.getUniqueValue(), groupGen, invGen);
            groupsEvaluated++;
        }

		this._markPriorGenerationStale();
        var purged = this._purgeStale();
        gs.info('PANTHEON | outlier eval complete | groups=' + groupsEvaluated +
                ' findings=' + findings + ' purged=' + purged +
                ' threshold=' + this.threshold);
        return { groups: groupsEvaluated, findings: findings };
    },

    _evaluateGroup: function (groupId, groupGen, invGen) {
        // Members of this group, current generation.
        var members = [];
        var mem = new GlideRecord(this.memberTable);
        mem.addQuery('peer_group', groupId);
        mem.addQuery('computed_on', groupGen);
        mem.query();
        while (mem.next()) {
            members.push(mem.getValue('user'));
        }
        if (members.length < 2) {
            return 0; // nobody to compare against
        }

        // One inventory query for the whole group. Tally counts
        // DISTINCT HOLDERS per role, not rows — a user reaching the
        // same role via two paths has two inventory rows but is one
        // holder. userRoles gets the same dedupe so the subject's own
        // multi-path role produces one finding, not two.
        var tally = {};      // role -> count of members holding it
        var userRoles = {};  // user -> { role: true }
        var seen = {};       // user|role -> true

        var inv = new GlideRecord(this.inventoryTable);
        inv.addQuery('user', 'IN', members.join(','));
        inv.addQuery('computed_on', invGen);
        inv.query();
        while (inv.next()) {
            var u = inv.getValue('user');
            var r = inv.getValue('role');
            var key = u + '|' + r;
            if (seen[key]) {
                continue;
            }
            seen[key] = true;

            tally[r] = (tally[r] || 0) + 1;
            if (!userRoles[u]) {
                userRoles[u] = {};
            }
            userRoles[u][r] = true;
        }

        // Second walk: subject excluded from both sides.
        var findings = 0;
        var peerDenominator = members.length - 1;

        for (var m = 0; m < members.length; m++) {
            var userId = members[m];
            var roles = userRoles[userId];
            if (!roles) {
                continue; // member with no grants at all
            }
            for (var role in roles) {
                if (!roles.hasOwnProperty(role)) {
                    continue;
                }
                var peerCount = tally[role] - 1; // remove the subject
                if (peerCount <= this.threshold) {
                    findings += this._writeFinding(
                        userId, role, groupId, peerCount, peerDenominator);
                }
            }
        }
        return findings;
    },

    _writeFinding: function (userId, roleId, groupId, peerCount, peerDenominator) {
        // Reason sentence matches the wireframe: "0 of 13 peers hold
        // this role." Role display name resolved here so the stored
        // sentence is complete without a join.
		
        var roleName = this._roleName(roleId);
        var reason = peerCount + ' of ' + peerDenominator +
                     ' peers hold ' + roleName;

        var f = new GlideRecord(this.findingTable);
        f.initialize();
        f.setWorkflow(false);
        f.setValue('user', userId);
        f.setValue('role', roleId);
        f.setValue('peer_group', groupId);
        f.setValue('peer_count', peerCount);
        f.setValue('group_size', peerDenominator);
        f.setValue('reason', reason);
        f.setValue('computed_on', this.computedOn);
		f.setValue('is_current', true);
        return f.insert() ? 1 : 0;
    },

    _roleName: function (roleId) {
        if (!this._roleNames) {
            this._roleNames = {};
            var gr = new GlideRecord('sys_user_role');
            gr.query();
            while (gr.next()) {
                this._roleNames[gr.getUniqueValue()] = gr.getValue('name');
            }
        }
        return this._roleNames[roleId] || roleId;
    },

    // Highest computed_on on a table = current generation. Returns
    // null on an empty table so build() can abort loudly instead of
    // evaluating nothing quietly. Ordered read rather than
    // GlideAggregate MAX: the aggregate returned null against a
    // populated table, and getValue here returns the stored format
    // that addQuery comparisons expect.
    _currentGeneration: function (table) {
        var gr = new GlideRecord(table);
        gr.orderByDesc('computed_on');
        gr.setLimit(1);
        gr.query();
        if (gr.next()) {
            return gr.getValue('computed_on') || null;
        }
        return null;
    },

    _purgeStale: function () {
        var gr = new GlideRecord(this.findingTable);
        gr.addQuery('computed_on', '!=', this.computedOn.getValue());
        gr.setWorkflow(false);
        gr.query();
        var n = gr.getRowCount();
        gr.deleteMultiple();
        return n;
    },

	_markPriorGenerationStale: function () {
        var gr = new GlideRecord(this.findingTable);
        gr.addQuery('computed_on', '!=', this.computedOn.getValue());
        gr.addQuery('is_current', true);
        gr.setWorkflow(false);
        gr.query();
        while (gr.next()) {
            gr.setValue('is_current', false);
            gr.update();
        }
    },

    type: 'OutlierEvaluator'
};