import React from "react";
import GraphCanvas from "./GraphCanvas";
import RiskSummary from "./RiskSummary";
import RankedFindingsList from "./RankedFindingsList";
import IrActionFooter from "./IrActionFooter";
import { Finding, GraphNodeData, RankedFinding } from "../types";

interface PageLayoutProps {
  finding: Finding;
  nodes: GraphNodeData[];
  rankedFindings: RankedFinding[];
}

// Stub for demo -- no export/runbook integration exists yet.
function handleExportGraph() {
  console.log("Export graph clicked (stub -- no export integration yet)");
}

function handleOpenRunbook() {
  console.log("Open runbook clicked (stub -- no runbook integration yet)");
}

export default function PageLayout({ finding, nodes, rankedFindings }: PageLayoutProps) {
  const rank = rankedFindings.findIndex(f => f.sysId === finding.sysId) + 1;

  return (
    <div className="blast-radius-page">
      <header className="blast-radius-page__header">
        <h1>Blast radius · {finding.entityName}</h1>
        <div className="blast-radius-page__actions">
          <button type="button" className="blast-radius__btn" onClick={handleExportGraph}>
            Export graph
          </button>
          <button type="button" className="blast-radius__btn" onClick={handleOpenRunbook}>
            Open runbook
          </button>
        </div>
      </header>
      <div className="blast-radius-page__body">
        <div className="blast-radius-page__main">
          <GraphCanvas finding={finding} nodes={nodes} />
        </div>
        <aside className="blast-radius-page__sidebar">
          <RiskSummary finding={finding} nodes={nodes} rank={rank} total={rankedFindings.length} />
          <RankedFindingsList findings={rankedFindings} currentSysId={finding.sysId} />
        </aside>
      </div>
      <IrActionFooter />
    </div>
  );
}
