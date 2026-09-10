import React from "react";

export default function PeerLegend() {
  return (
    <div className="pf__legend">
      <div className="pf__legend-item">
        <span className="pf__legend-swatch pf__legend-swatch--member" />
        Peer group member
      </div>
      <div className="pf__legend-item">
        <span className="pf__legend-swatch pf__legend-swatch--outlier" />
        Outlier (click for detail)
      </div>
    </div>
  );
}
