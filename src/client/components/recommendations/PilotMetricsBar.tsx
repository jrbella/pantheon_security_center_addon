import React from "react";
import { PilotMetrics } from "../../recommendationsTypes";

interface PilotMetricsBarProps {
  metrics: PilotMetrics;
}

export default function PilotMetricsBar({ metrics }: PilotMetricsBarProps) {
  return (
    <footer className="rec__metrics">
      <div className="rec__metric">
        <span className="rec__metric-label">Avg roles/user — before</span>
        <strong className="rec__metric-value">{metrics.avgRolesBeforePerUser}</strong>
      </div>
      <div className="rec__metric">
        <span className="rec__metric-label">Avg roles/user — after</span>
        <strong className="rec__metric-value">{metrics.avgRolesAfterPerUser}</strong>
      </div>
      <div className="rec__metric">
        <span className="rec__metric-label">
          Acceptance rate <em>(demo placeholder)</em>
        </span>
        <strong className="rec__metric-value">{metrics.acceptanceRatePct}%</strong>
      </div>
      <div className="rec__metric">
        <span className="rec__metric-label">
          Rollback rate <em>(demo placeholder)</em>
        </span>
        <strong className="rec__metric-value">{metrics.rollbackRatePct}%</strong>
      </div>
      <div className="rec__metric rec__metric--note">
        Sample size: {metrics.sampleSize} identity reviewed so far on this pilot
      </div>
    </footer>
  );
}
