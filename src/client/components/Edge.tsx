import React from "react";

interface EdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export default function Edge({ x1, y1, x2, y2 }: EdgeProps) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} className="blast-radius__edge" />;
}
