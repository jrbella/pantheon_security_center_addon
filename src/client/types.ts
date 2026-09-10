export interface Finding {
  sysId: string;
  entityName: string;
  entityType: string;
  score: number;
  hopCount: number;
  sensitiveTableCount: number;
}

export interface GraphNodeData {
  sysId: string;
  label: string;
  category: "role" | "table";
  hopDistance: number;
  isSensitive: boolean;
  recordSysId: string | null;
}

export type DisplayCategory = "role" | "table" | "impersonation-path" | "group";

export interface NodeTooltipData {
  kind: "node";
  label: string;
  category: DisplayCategory;
  hopDistance: number;
  isSensitive: boolean;
}

export interface CenterTooltipData {
  kind: "center";
  label: string;
  entityType: string;
  score: number;
}

export type TooltipData = NodeTooltipData | CenterTooltipData;

export interface RankedFinding {
  sysId: string;
  entityName: string;
  score: number;
}
