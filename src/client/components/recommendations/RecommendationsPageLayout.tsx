import React from "react";
import { IdentitySummary, RoleRecommendation } from "../../recommendationsTypes";
import RoleTable from "./RoleTable";
import SimulationPanel from "./SimulationPanel";
import ApplyPanel from "./ApplyPanel";
import PilotMetricsBar from "./PilotMetricsBar";

interface RecommendationsPageLayoutProps {
  summary: IdentitySummary;
  selected: RoleRecommendation | null;
  onSelect: (role: RoleRecommendation) => void;
  onResolved: () => void;
}

export default function RecommendationsPageLayout({
  summary,
  selected,
  onSelect,
  onResolved
}: RecommendationsPageLayoutProps) {
  return (
    <div className="rec-page">
      <header className="rec-page__header">
        <h1>Least-privilege recommendations · {summary.identity.name}</h1>
      </header>
      <div className="rec-page__body">
        <div className="rec-page__main">
          <RoleTable roles={summary.roles} selectedSysId={selected?.sysId || null} onSelect={onSelect} />
        </div>
        <aside className="rec-page__sidebar">
          <SimulationPanel simulation={summary.simulation} />
          <ApplyPanel selected={selected} onResolved={onResolved} />
        </aside>
      </div>
      <PilotMetricsBar metrics={summary.pilotMetrics} />
    </div>
  );
}
