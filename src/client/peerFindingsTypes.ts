export interface PeerGroup {
  sysId: string;
  number: string;
  label: string;
  memberCount: number;
}

export interface OutlierFinding {
  sysId: string;
  roleName: string;
  reason: string;
  disposition: string;
  groupSize: number;
  peerCount: number;
  openedOn: string;
  reviewedBy: string;
  reviewedOn: string;
}

export interface Member {
  sysId: string;
  userSysId: string;
  userName: string;
  peerGroupSysId: string;
  findings: OutlierFinding[];
}

export interface PositionedMember extends Member {
  x: number;
  y: number;
}

export interface ClusterLayout {
  group: PeerGroup;
  cx: number;
  cy: number;
  radius: number;
}

export type PeerTooltipData =
  | { kind: "member"; userName: string; groupLabel: string }
  | { kind: "outlier"; userName: string; groupLabel: string; reasons: string[] };
