import { Finding, GraphNodeData } from "../types";

// Built only from real per-node data (label, hop_distance, is_sensitive) --
// there is no stored path-chain between nodes, so this never invents an
// intermediate hop that wasn't actually computed.
export function buildReachabilityNarrative(finding: Finding, nodes: GraphNodeData[]): string {
  const sensitiveTables = nodes.filter(n => n.isSensitive);

  if (sensitiveTables.length === 0) {
    return `No sensitive tables currently reachable from ${finding.entityName}.`;
  }

  const closest = sensitiveTables.reduce((min, n) => (n.hopDistance < min.hopDistance ? n : min));
  const extra = sensitiveTables.length > 1 ? ` (and ${sensitiveTables.length - 1} more)` : "";

  return `Reaches ${closest.label} at hop distance ${closest.hopDistance}${extra}.`;
}
