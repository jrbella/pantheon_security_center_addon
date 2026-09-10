import React from "react";
import { SimulationResult } from "../../recommendationsTypes";

interface SimulationPanelProps {
  simulation: SimulationResult;
}

export default function SimulationPanel({ simulation }: SimulationPanelProps) {
  const { totalActions, allowedActions, blockedActions, successRatePct } = simulation;
  const pct = Math.max(0, Math.min(100, successRatePct));

  return (
    <div className="rec__panel">
      <div className="rec__panel-title">Simulation — last 180 days replayed</div>
      <div className="rec__sim-fraction">
        {allowedActions.toLocaleString()} / {totalActions.toLocaleString()}
        <span className="rec__sim-fraction-label">actions allowed</span>
      </div>
      <div className="rec__progress">
        <div className="rec__progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="rec__sim-statement">
        {blockedActions === 0
          ? `Every real action from the last 180 days would still succeed under the proposed role set (${successRatePct}% success).`
          : `${blockedActions.toLocaleString()} of ${totalActions.toLocaleString()} real actions would have been blocked under the proposed role set (${successRatePct}% success).`}
      </p>
    </div>
  );
}
