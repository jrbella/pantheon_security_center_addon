import React from "react";
import { PeerGroup, PositionedMember } from "../../peerFindingsTypes";

interface OutlierDetailPanelProps {
  selected: PositionedMember | null;
  groups: PeerGroup[];
}

function dispositionLabel(disposition: string): string {
  if (disposition === "revoked") return "Revoked";
  if (disposition === "kept") return "Kept";
  return "Pending review";
}

export default function OutlierDetailPanel({ selected, groups }: OutlierDetailPanelProps) {
  if (!selected) {
    return (
      <div className="pf__panel">
        <div className="pf__panel-title">Outlier detail</div>
        <p className="pf__panel-empty">Click a highlighted member in the canvas to see why they were flagged.</p>
      </div>
    );
  }

  const group = groups.find(g => g.sysId === selected.peerGroupSysId);

  return (
    <div className="pf__panel">
      <div className="pf__panel-title">Outlier detail</div>
      <div className="pf__detail-identity">
        <strong>{selected.userName}</strong>
        <span className="pf__detail-group">{group?.label || selected.peerGroupSysId}</span>
      </div>
      {selected.findings.map((finding, i) => (
        <div className="pf__finding" key={i}>
          <div className="pf__finding-role">{finding.roleName}</div>
          <div className="pf__finding-reason">{finding.reason}</div>
          <div className="pf__finding-row">
            <span>Peers with this role</span>
            <strong>
              {finding.peerCount} / {finding.groupSize}
            </strong>
          </div>
          <div className="pf__finding-row">
            <span>Disposition</span>
            <span className={`pf__status pf__status--${finding.disposition}`}>
              {dispositionLabel(finding.disposition)}
            </span>
          </div>
          {finding.openedOn && (
            <div className="pf__finding-row">
              <span>Opened</span>
              <span>{finding.openedOn}</span>
            </div>
          )}
          {finding.reviewedBy && (
            <div className="pf__finding-row">
              <span>Reviewed by</span>
              <span>
                {finding.reviewedBy} ({finding.reviewedOn})
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
