import { DisplayCategory, GraphNodeData } from "../types";

const IMPERSONATION_LABEL_PATTERN = /admin|impersonat/i;

// Cheap deterministic hash so the same node always lands in the same
// cosmetic bucket across reloads, without needing any real signal.
function hashCode(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// DEMO ONLY: cosmetic sub-categorization, not backed by real traversal
// data. blast_radius_node only ever stores category 'role' or 'table' --
// BlastRadiusEvaluator has no concept of 'impersonation-path' or 'group'
// and was not changed to add one. This exists purely so the demo graph can
// show all four wireframe colors (role/table/impersonation-path/group).
// Delete this function, its two cosmetic CSS node/legend classes, and the
// two extra Legend entries once real traversal data backs those two
// categories -- everything cosmetic is isolated to this one file.
export function getDisplayCategory(node: GraphNodeData): DisplayCategory {
  // is_sensitive is a REAL signal (a hit against sensitive_table_register)
  // and must never be repainted into a cosmetic bucket, so sensitive nodes
  // always keep their real category here -- the sensitive-table color is
  // then layered on top at render time regardless of this function.
  if (node.isSensitive) {
    return node.category;
  }

  if (node.category === "role" && IMPERSONATION_LABEL_PATTERN.test(node.label)) {
    return "impersonation-path";
  }

  // One in seven eligible nodes, chosen by a hash of the node's own
  // sys_id so the assignment is stable across reloads -- not a real
  // group-membership signal.
  if (hashCode(node.sysId) % 7 === 0) {
    return "group";
  }

  return node.category;
}
