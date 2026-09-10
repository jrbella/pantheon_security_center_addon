import React from "react";
import { PeerTooltipData } from "../../peerFindingsTypes";

interface PeerTooltipProps {
  x: number;
  y: number;
  data: PeerTooltipData;
}

export default function PeerTooltip({ x, y, data }: PeerTooltipProps) {
  return (
    <div className="pf__tooltip" style={{ left: x + 16, top: y + 16 }}>
      <div className="pf__tooltip-title">{data.userName}</div>
      <div className="pf__tooltip-row">Peer group: {data.groupLabel}</div>
      {data.kind === "outlier" &&
        data.reasons.map((reason, i) => (
          <div className="pf__tooltip-row pf__tooltip-row--warning" key={i}>
            {reason}
          </div>
        ))}
    </div>
  );
}
