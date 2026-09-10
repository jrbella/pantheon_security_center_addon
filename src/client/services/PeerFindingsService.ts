import { display, value } from "../utils/fields";
import { PeerGroup, Member, OutlierFinding } from "../peerFindingsTypes";

const GROUP_TABLE = "x_1906124_pantheon_peer_group";
const MEMBER_TABLE = "x_1906124_pantheon_peer_group_member";
const FINDING_TABLE = "x_1906124_pantheon_outlier_finding";

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

export async function getPeerGroups(): Promise<PeerGroup[]> {
  const params = new URLSearchParams({
    sysparm_display_value: "all",
    sysparm_fields: "sys_id,number,label,member_count",
    sysparm_limit: "50"
  });
  const { result } = await tableGet(`/api/now/table/${GROUP_TABLE}?${params}`);
  return (result || []).map((row: any) => ({
    sysId: value(row.sys_id),
    number: value(row.number),
    label: display(row.label) || value(row.number),
    memberCount: Number(value(row.member_count)) || 0
  }));
}

// Fetches every peer_group_member row and every current outlier_finding row,
// then joins them client-side by (user, peer_group) -- a member with one or
// more matching findings renders as an outlier.
export async function getMembersWithFindings(): Promise<Member[]> {
  const memberParams = new URLSearchParams({
    sysparm_display_value: "all",
    sysparm_fields: "sys_id,user,peer_group",
    sysparm_limit: "1000"
  });
  const findingParams = new URLSearchParams({
    sysparm_query: "is_current=true",
    sysparm_display_value: "all",
    sysparm_fields: "user,peer_group,role,reason,disposition,group_size,peer_count,opened_on,reviewed_by,reviewed_on",
    sysparm_limit: "500"
  });

  const [memberRes, findingRes] = await Promise.all([
    tableGet(`/api/now/table/${MEMBER_TABLE}?${memberParams}`),
    tableGet(`/api/now/table/${FINDING_TABLE}?${findingParams}`)
  ]);

  const findingsByKey = new Map<string, OutlierFinding[]>();
  for (const row of findingRes.result || []) {
    const key = `${value(row.user)}|${value(row.peer_group)}`;
    const finding: OutlierFinding = {
      sysId: key,
      roleName: display(row.role) || "(unresolved role)",
      reason: display(row.reason) || value(row.reason),
      disposition: value(row.disposition),
      groupSize: Number(value(row.group_size)) || 0,
      peerCount: Number(value(row.peer_count)) || 0,
      openedOn: display(row.opened_on),
      reviewedBy: display(row.reviewed_by),
      reviewedOn: display(row.reviewed_on)
    };
    const existing = findingsByKey.get(key) || [];
    existing.push(finding);
    findingsByKey.set(key, existing);
  }

  return (memberRes.result || []).map((row: any) => {
    const userSysId = value(row.user);
    const peerGroupSysId = value(row.peer_group);
    const key = `${userSysId}|${peerGroupSysId}`;
    return {
      sysId: value(row.sys_id),
      userSysId,
      userName: display(row.user) || userSysId,
      peerGroupSysId,
      findings: findingsByKey.get(key) || []
    };
  });
}
