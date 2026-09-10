// Classic UI form URL pattern, confirmed against this instance's own
// navigation modules rather than assumed: the "Roles" module (System
// Security > Roles) targets sys_user_role, and the "Tables" module
// (System Definition > Tables) targets sys_db_object -- both LIST-type,
// both using the standard <table>.do?sys_id=<sys_id> classic form route.
const ROLE_FORM_PATH = "sys_user_role.do";
const TABLE_FORM_PATH = "sys_db_object.do";

export function buildRecordUrl(category: "role" | "table", recordSysId: string | null): string | null {
  if (!recordSysId) {
    return null;
  }
  const path = category === "role" ? ROLE_FORM_PATH : TABLE_FORM_PATH;
  return `${path}?sys_id=${recordSysId}`;
}
