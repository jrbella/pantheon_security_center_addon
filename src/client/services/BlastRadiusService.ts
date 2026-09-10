import { display, value } from "../utils/fields";
import { Finding, GraphNodeData, RankedFinding } from "../types";

const FINDING_TABLE = "x_1906124_pantheon_blast_radius_finding";
const NODE_TABLE = "x_1906124_pantheon_blast_radius_node";

async function tableGet(path: string): Promise<any> {
  const response = await fetch(path, {
    headers: {
      Accept: "application/json",
      "X-UserToken": (window as any).g_ck
    }
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

export async function getHighestScoreFindingId(): Promise<string> {
  const params = new URLSearchParams({
    sysparm_query: "ORDERBYDESCscore",
    sysparm_limit: "1",
    sysparm_fields: "sys_id",
    sysparm_display_value: "all"
  });
  const { result } = await tableGet(`/api/now/table/${FINDING_TABLE}?${params}`);
  if (!result || !result.length) {
    throw new Error("No blast_radius_finding records exist yet");
  }
  return value(result[0].sys_id);
}

export async function getFinding(findingId: string): Promise<Finding> {
  const params = new URLSearchParams({ sysparm_display_value: "all" });
  const { result } = await tableGet(`/api/now/table/${FINDING_TABLE}/${findingId}?${params}`);
  return {
    sysId: value(result.sys_id),
    entityName: display(result.entity_name) || value(result.entity_sys_id),
    entityType: value(result.entity_type),
    score: Number(value(result.score)) || 0,
    hopCount: Number(value(result.hop_count)) || 0,
    sensitiveTableCount: Number(value(result.sensitive_table_count)) || 0
  };
}

export async function getAllFindings(): Promise<RankedFinding[]> {
  const params = new URLSearchParams({
    sysparm_query: "ORDERBYDESCscore",
    sysparm_fields: "sys_id,entity_name,score",
    sysparm_display_value: "all",
    sysparm_limit: "50"
  });
  const { result } = await tableGet(`/api/now/table/${FINDING_TABLE}?${params}`);
  return (result || []).map((row: any) => ({
    sysId: value(row.sys_id),
    entityName: display(row.entity_name) || value(row.sys_id),
    score: Number(value(row.score)) || 0
  }));
}

export async function getNodes(findingId: string): Promise<GraphNodeData[]> {
  const params = new URLSearchParams({
    sysparm_query: `finding=${findingId}`,
    sysparm_display_value: "all",
    sysparm_limit: "200"
  });
  const { result } = await tableGet(`/api/now/table/${NODE_TABLE}?${params}`);
  return (result || [])
    .map((row: any) => ({
      sysId: value(row.sys_id),
      label: display(row.label),
      category: value(row.category),
      hopDistance: Number(value(row.hop_distance)) || 0,
      isSensitive: value(row.is_sensitive) === "true",
      recordSysId: value(row.record_sys_id) || null
    }))
    .filter((n: GraphNodeData) => n.category === "role" || n.category === "table");
}
