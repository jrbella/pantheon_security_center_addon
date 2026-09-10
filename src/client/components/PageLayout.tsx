import React from "react";
import GraphCanvas from "./GraphCanvas";
import RiskSummary from "./RiskSummary";
import RankedFindingsList from "./RankedFindingsList";
import IrActionFooter from "./IrActionFooter";
import { Finding, GraphNodeData, RankedFinding } from "../types";
import { isDeEmphasizedEntity } from "../utils/deemphasis";

interface PageLayoutProps {
  finding: Finding;
  nodes: GraphNodeData[];
  rankedFindings: RankedFinding[];
}

export default function PageLayout({ finding, nodes, rankedFindings }: PageLayoutProps) {
  const rank = rankedFindings.findIndex(f => f.sysId === finding.sysId) + 1;

  return (
    <div className="blast-radius-page">
      <header className="blast-radius-page__header">
        {/* DISPLAY-ONLY: see utils/deemphasis.ts -- cosmetic muting, not a data signal. */}
        <h1 className={isDeEmphasizedEntity(finding.entityName) ? "blast-radius-page__header-title--muted" : ""}>
          Blast radius · {finding.entityName}
        </h1>
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
