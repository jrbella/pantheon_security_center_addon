import React from "react";
import { TooltipData } from "../types";

interface TooltipProps {
  x: number;
  y: number;
  data: TooltipData;
}

export default function Tooltip({ x, y, data }: TooltipProps) {
  return (
    <div className="blast-radius__tooltip" style={{ left: x + 16, top: y + 16 }}>
      <div className="blast-radius__tooltip-title">{data.label}</div>
      {data.kind === "node" ? (
        <>
          <div className="blast-radius__tooltip-row">Category: {data.category}</div>
          <div className="blast-radius__tooltip-row">Hop distance: {data.hopDistance}</div>
          {data.isSensitive && (
            <div className="blast-radius__tooltip-row blast-radius__tooltip-row--warning">
              Sensitive table
            </div>
          )}
        </>
      ) : (
        <>
          <div className="blast-radius__tooltip-row">Entity type: {data.entityType}</div>
          <div className="blast-radius__tooltip-row">Score: {data.score}</div>
        </>
      )}
    </div>
  );
}
