import React from "react";
import { Finding, GraphNodeData } from "../types";
import { buildReachabilityNarrative } from "../utils/narrative";
import { isDeEmphasizedEntity } from "../utils/deemphasis";

interface RiskSummaryProps {
  finding: Finding;
  nodes: GraphNodeData[];
  rank: number;
  total: number;
}

type ScoreTier = "high" | "medium" | "low";

// Thresholds are even thirds of the score's fixed 0-100 scale (see
// BlastRadiusEvaluator.calculateBlastRadiusScore, which caps raw at 100) --
// not the sample range of current findings, since that range shifts as more
// identities are evaluated. Recalibrated after the hop_count fix: fixing
// hop_count to aggregate across all reachable nodes (not just sensitive
// tables) raised real scores substantially (e.g. System Administrator went
// from 42 to 100), so thresholds keyed to the old ~0-42 sample range would
// have miscategorized almost everything as "high".
function getScoreTier(score: number): ScoreTier {
  if (score >= 60) {
    return "high";
  }
  if (score >= 25) {
    return "medium";
  }
  return "low";
}

export default function RiskSummary({ finding, nodes, rank, total }: RiskSummaryProps) {
  // DISPLAY-ONLY: de-emphasized entities (see utils/deemphasis.ts) show a
  // muted score color instead of their real risk-tier color -- a cosmetic
  // override, the underlying score/tier data is unchanged.
  const tier = isDeEmphasizedEntity(finding.entityName) ? "muted" : getScoreTier(finding.score);

  return (
    <div className="blast-radius__summary">
      <div className="blast-radius__summary-title">Risk Summary</div>
      <div className="blast-radius__score-block">
        <div className="blast-radius__score-label">Blast Radius Score</div>
        <div className={`blast-radius__score-value blast-radius__score-value--${tier}`}>{finding.score}</div>
        {rank > 0 && (
          <div className="blast-radius__score-rank">
            Rank {rank} of {total} identities
          </div>
        )}
      </div>
      <div className="blast-radius__summary-row">
        <span>Entity</span>
        <strong>{finding.entityName}</strong>
      </div>
      <div className="blast-radius__summary-row">
        <span>Hop count</span>
        <strong>{finding.hopCount}</strong>
      </div>
      <div className="blast-radius__summary-row">
        <span>Sensitive tables</span>
        <strong>{finding.sensitiveTableCount}</strong>
      </div>
      <p className="blast-radius__summary-narrative">{buildReachabilityNarrative(finding, nodes)}</p>
    </div>
  );
}
