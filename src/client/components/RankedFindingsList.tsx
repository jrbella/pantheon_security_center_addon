import React from "react";
import { RankedFinding } from "../types";
import { getReviewCadence } from "../utils/reviewCadence";
import { isDeEmphasizedEntity } from "../utils/deemphasis";

interface RankedFindingsListProps {
  findings: RankedFinding[];
  currentSysId: string;
}

export default function RankedFindingsList({ findings, currentSysId }: RankedFindingsListProps) {
  return (
    <div className="blast-radius__ranked">
      <div className="blast-radius__ranked-title">Highest blast radius · all identities</div>
      <ol className="blast-radius__ranked-list">
        {findings.map((f, i) => {
          const cadence = getReviewCadence(i);
          const deEmphasized = isDeEmphasizedEntity(f.entityName);
          return (
            <li
              key={f.sysId}
              className={
                "blast-radius__ranked-row" +
                (f.sysId === currentSysId ? " blast-radius__ranked-row--current" : "") +
                // DISPLAY-ONLY: see utils/deemphasis.ts -- cosmetic muting, not a data signal.
                (deEmphasized ? " blast-radius__ranked-row--muted" : "")
              }
            >
              <a href={`?finding=${f.sysId}`} className="blast-radius__ranked-link">
                <span className="blast-radius__ranked-rank">#{i + 1}</span>
                <span className="blast-radius__ranked-name">{f.entityName}</span>
                {/* DEMO ONLY: cadence has no backing data, see utils/reviewCadence.ts */}
                <span
                  className={`blast-radius__ranked-review blast-radius__ranked-review--${cadence.toLowerCase()}`}
                >
                  {cadence}
                </span>
                <span className="blast-radius__ranked-score">{f.score}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
