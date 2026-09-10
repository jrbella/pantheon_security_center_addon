import React from "react";
import { Finding, GraphNodeData } from "../types";
import { buildReachabilityNarrative } from "../utils/narrative";

interface RiskSummaryProps {
  finding: Finding;
  nodes: GraphNodeData[];
  rank: number;
  total: number;
}

export default function RiskSummary({ finding, nodes, rank, total }: RiskSummaryProps) {
  return (
    <div className="blast-radius__summary">
      <div className="blast-radius__summary-title">Risk Summary</div>
      <div className="blast-radius__summary-row">
        <span>Entity</span>
        <strong>{finding.entityName}</strong>
      </div>
      <div className="blast-radius__summary-row">
        <span>Score</span>
        <strong>{finding.score}</strong>
      </div>
      <div className="blast-radius__summary-row">
        <span>Hop count</span>
        <strong>{finding.hopCount}</strong>
      </div>
      <div className="blast-radius__summary-row">
        <span>Sensitive tables</span>
        <strong>{finding.sensitiveTableCount}</strong>
      </div>
      {rank > 0 && (
        <div className="blast-radius__summary-row">
          <span>Rank</span>
          <strong>
            {rank} of {total} identities
          </strong>
        </div>
      )}
      <p className="blast-radius__summary-narrative">{buildReachabilityNarrative(finding, nodes)}</p>
    </div>
  );
}
