import React from "react";
import { RankedFinding } from "../types";

interface RankedFindingsListProps {
  findings: RankedFinding[];
  currentSysId: string;
}

export default function RankedFindingsList({ findings, currentSysId }: RankedFindingsListProps) {
  return (
    <div className="blast-radius__ranked">
      <div className="blast-radius__ranked-title">Highest blast radius · all identities</div>
      <ol className="blast-radius__ranked-list">
        {findings.map((f, i) => (
          <li
            key={f.sysId}
            className={
              "blast-radius__ranked-row" +
              (f.sysId === currentSysId ? " blast-radius__ranked-row--current" : "")
            }
          >
            <a href={`?finding=${f.sysId}`} className="blast-radius__ranked-link">
              <span className="blast-radius__ranked-rank">#{i + 1}</span>
              <span className="blast-radius__ranked-name">{f.entityName}</span>
              <span className="blast-radius__ranked-score">{f.score}</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
