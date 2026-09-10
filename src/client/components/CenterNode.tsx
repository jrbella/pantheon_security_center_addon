import React from "react";
import { CenterTooltipData } from "../types";

interface CenterNodeProps {
  x: number;
  y: number;
  label: string;
  entityType: string;
  score: number;
  radius: number;
  fontSize: number;
  labelOffset: number;
  onHover: (e: React.MouseEvent, data: CenterTooltipData) => void;
  onLeave: () => void;
}

export default function CenterNode({
  x,
  y,
  label,
  entityType,
  score,
  radius,
  fontSize,
  labelOffset,
  onHover,
  onLeave
}: CenterNodeProps) {
  const data: CenterTooltipData = { kind: "center", label, entityType, score };

  return (
    <g className="blast-radius__center" onMouseMove={e => onHover(e, data)} onMouseLeave={onLeave}>
      <circle cx={x} cy={y} r={radius} className="blast-radius__center-node" />
      <text
        x={x}
        y={y + labelOffset}
        textAnchor="middle"
        style={{ fontSize }}
        className="blast-radius__center-label"
      >
        {label}
      </text>
    </g>
  );
}
