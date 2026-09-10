import React from "react";
import { PeerGroup, Member } from "../../peerFindingsTypes";

interface SummaryStatsProps {
  groups: PeerGroup[];
  members: Member[];
}

export default function SummaryStats({ groups, members }: SummaryStatsProps) {
  const totalMembers = members.length;
  const outlierMembers = members.filter(m => m.findings.length > 0).length;
  const totalFindings = members.reduce((sum, m) => sum + m.findings.length, 0);

  return (
    <div className="pf__panel">
      <div className="pf__panel-title">Summary</div>
      <div className="pf__summary-row">
        <span>Peer groups</span>
        <strong>{groups.length}</strong>
      </div>
      <div className="pf__summary-row">
        <span>Members clustered</span>
        <strong>{totalMembers.toLocaleString()}</strong>
      </div>
      <div className="pf__summary-row">
        <span>Identities flagged</span>
        <strong>{outlierMembers}</strong>
      </div>
      <div className="pf__summary-row">
        <span>Total findings</span>
        <strong>{totalFindings}</strong>
      </div>
    </div>
  );
}
