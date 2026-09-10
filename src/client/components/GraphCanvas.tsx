import React, { useRef, useState } from "react";
import Node from "./Node";
import Edge from "./Edge";
import Legend from "./Legend";
import CenterNode from "./CenterNode";
import Tooltip from "./Tooltip";
import { computeSize, computeVisualParams, layoutNodes } from "../utils/layout";
import { getDisplayCategory } from "../utils/displayCategory";
import { Finding, GraphNodeData, TooltipData } from "../types";

interface GraphCanvasProps {
  finding: Finding;
  nodes: GraphNodeData[];
}

export default function GraphCanvas({ finding, nodes }: GraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ x: number; y: number; data: TooltipData } | null>(null);

  const size = computeSize(nodes);
  const center = size / 2;
  const positioned = layoutNodes(nodes, center);
  const visual = computeVisualParams(size);
  const categories = Array.from(
    new Set(nodes.map(n => (n.isSensitive ? "sensitive-table" : getDisplayCategory(n))))
  );
  // Real signal, not cosmetic: the 'impersonator' role only ever shows up
  // as a node when the evaluator's traversal actually reached it.
  const hasImpersonation = nodes.some(n => n.category === "role" && n.label === "impersonator");

  function handleHover(e: React.MouseEvent, data: TooltipData) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHover({ x: e.clientX - rect.left, y: e.clientY - rect.top, data });
  }

  const clearHover = () => setHover(null);

  return (
    <div className="blast-radius__canvas" ref={containerRef}>
      <svg viewBox={`0 0 ${size} ${size}`} className="blast-radius__svg">
        {positioned.map(n => (
          <Edge key={`edge-${n.sysId}`} x1={center} y1={center} x2={n.x} y2={n.y} />
        ))}
        {positioned.map(n => (
          <Node
            key={n.sysId}
            x={n.x}
            y={n.y}
            label={n.label}
            category={n.category}
            displayCategory={getDisplayCategory(n)}
            isSensitive={n.isSensitive}
            hopDistance={n.hopDistance}
            showLabel={n.showLabel}
            radius={n.isSensitive ? visual.sensitiveRadius : visual.nodeRadius}
            fontSize={visual.nodeFontSize}
            labelOffset={visual.nodeLabelOffset}
            recordSysId={n.recordSysId}
            onHover={handleHover}
            onLeave={clearHover}
          />
        ))}
        <CenterNode
          x={center}
          y={center}
          label={finding.entityName}
          entityType={finding.entityType}
          score={finding.score}
          radius={visual.centerRadius}
          fontSize={visual.centerFontSize}
          labelOffset={visual.centerLabelOffset}
          onHover={handleHover}
          onLeave={clearHover}
        />
      </svg>
      <Legend categories={categories} />
      <div className="blast-radius__stat-line">
        {finding.hopCount} hops · {finding.sensitiveTableCount} sensitive tables reachable
        {hasImpersonation ? " · impersonation entitlement present" : ""}
      </div>
      {hover && <Tooltip x={hover.x} y={hover.y} data={hover.data} />}
    </div>
  );
}
