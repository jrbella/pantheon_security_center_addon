import React from "react";
import { DisplayCategory, GraphNodeData, NodeTooltipData } from "../types";
import { buildRecordUrl } from "../utils/records";

const LABEL_MAX_CHARS = 16;

function truncate(label: string): string {
  if (label.length <= LABEL_MAX_CHARS) {
    return label;
  }
  return `${label.slice(0, LABEL_MAX_CHARS - 1)}…`;
}

interface NodeProps {
  x: number;
  y: number;
  label: string;
  category: GraphNodeData["category"];
  displayCategory: DisplayCategory;
  isSensitive: boolean;
  hopDistance: number;
  showLabel: boolean;
  radius: number;
  fontSize: number;
  labelOffset: number;
  recordSysId: string | null;
  onHover: (e: React.MouseEvent, data: NodeTooltipData) => void;
  onLeave: () => void;
}

export default function Node({
  x,
  y,
  label,
  category,
  displayCategory,
  isSensitive,
  hopDistance,
  showLabel,
  radius,
  fontSize,
  labelOffset,
  recordSysId,
  onHover,
  onLeave
}: NodeProps) {
  const className = [
    "blast-radius__node",
    `blast-radius__node--${displayCategory}`,
    isSensitive ? "blast-radius__node--sensitive" : ""
  ]
    .filter(Boolean)
    .join(" ");

  const data: NodeTooltipData = { kind: "node", label, category: displayCategory, hopDistance, isSensitive };

  function handleClick() {
    // Always the REAL category here, never displayCategory -- the record
    // opened is a genuine sys_user_role/sys_db_object row regardless of
    // which cosmetic bucket the node is painted for the demo.
    const url = buildRecordUrl(category, recordSysId);
    if (url) {
      window.open(url, "_blank", "noopener");
    }
  }

  return (
    <g
      className={className}
      onMouseMove={e => onHover(e, data)}
      onMouseLeave={onLeave}
      onClick={handleClick}
    >
      <circle cx={x} cy={y} r={radius} className="blast-radius__node-circle" />
      {showLabel && (
        <text
          x={x}
          y={y + labelOffset}
          textAnchor="middle"
          style={{ fontSize }}
          className="blast-radius__node-label"
        >
          {truncate(label)}
        </text>
      )}
    </g>
  );
}
