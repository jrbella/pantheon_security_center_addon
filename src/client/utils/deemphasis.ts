const DEEMPHASIZED_ENTITY_NAMES = new Set(["System Administrator"]);

// DISPLAY-ONLY: entities listed here are shown visually muted/de-prioritized
// in the ranked list and on their own finding page. Matched purely by
// entity_name string -- there is no backing field or flag anywhere in the
// schema (blast_radius_finding has no such column), so this must never be
// read as a real risk signal, only a cosmetic presentation choice.
export function isDeEmphasizedEntity(entityName: string): boolean {
  return DEEMPHASIZED_ENTITY_NAMES.has(entityName);
}
