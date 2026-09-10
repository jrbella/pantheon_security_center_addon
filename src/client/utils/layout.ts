import { GraphNodeData } from "../types";

export const RING_BASE = 100;
export const RING_SPACING = 110;
export const CANVAS_MARGIN = 90;
export const MIN_SIZE = 400;
// Rings with more nodes than this render circles only by default; the full
// label is still available via hover, since truncation alone can't keep
// 20+ labels legible on one ring.
export const LABEL_HIDE_THRESHOLD = 8;

// The viewBox is sized dynamically (see computeSize), which means a fixed
// SVG user-unit radius/font-size renders at very different on-screen pixel
// sizes depending on hop count. CONTAINER_MAX_WIDTH is the CSS max-width the
// <svg> renders at (kept in sync with .blast-radius__svg); every *_PX
// constant below is a target on-screen pixel size, converted to the
// viewBox's user units via pxToUserUnits so legibility stays constant
// regardless of how large the computed viewBox gets.
export const CONTAINER_MAX_WIDTH = 960;
export const NODE_RADIUS_PX = 15;
export const SENSITIVE_RADIUS_PX = 19;
export const CENTER_RADIUS_PX = 34;
export const NODE_FONT_PX = 13;
export const CENTER_FONT_PX = 19;
export const NODE_LABEL_OFFSET_PX = 24;
export const CENTER_LABEL_OFFSET_PX = 48;

export interface Positioned extends GraphNodeData {
  x: number;
  y: number;
  showLabel: boolean;
}

export interface VisualParams {
  nodeRadius: number;
  sensitiveRadius: number;
  nodeFontSize: number;
  nodeLabelOffset: number;
  centerRadius: number;
  centerFontSize: number;
  centerLabelOffset: number;
}

export function pxToUserUnits(px: number, viewBoxSize: number): number {
  return (px * viewBoxSize) / CONTAINER_MAX_WIDTH;
}

export function computeVisualParams(size: number): VisualParams {
  return {
    nodeRadius: pxToUserUnits(NODE_RADIUS_PX, size),
    sensitiveRadius: pxToUserUnits(SENSITIVE_RADIUS_PX, size),
    nodeFontSize: pxToUserUnits(NODE_FONT_PX, size),
    nodeLabelOffset: pxToUserUnits(NODE_LABEL_OFFSET_PX, size),
    centerRadius: pxToUserUnits(CENTER_RADIUS_PX, size),
    centerFontSize: pxToUserUnits(CENTER_FONT_PX, size),
    centerLabelOffset: pxToUserUnits(CENTER_LABEL_OFFSET_PX, size)
  };
}

export function computeSize(nodes: GraphNodeData[]): number {
  const maxHop = nodes.reduce((max, n) => Math.max(max, n.hopDistance), 0);
  return Math.max(MIN_SIZE, 2 * (RING_BASE + maxHop * RING_SPACING + CANVAS_MARGIN));
}

export function layoutNodes(nodes: GraphNodeData[], center: number): Positioned[] {
  const byHop = new Map<number, GraphNodeData[]>();
  nodes.forEach(n => {
    const group = byHop.get(n.hopDistance) || [];
    group.push(n);
    byHop.set(n.hopDistance, group);
  });

  const positioned: Positioned[] = [];
  byHop.forEach((group, hop) => {
    const radius = RING_BASE + hop * RING_SPACING;
    const showLabel = group.length <= LABEL_HIDE_THRESHOLD;
    group.forEach((n, i) => {
      const angle = (i / group.length) * 2 * Math.PI;
      positioned.push({
        ...n,
        x: center + radius * Math.cos(angle),
        y: center + radius * Math.sin(angle),
        showLabel
      });
    });
  });
  return positioned;
}
