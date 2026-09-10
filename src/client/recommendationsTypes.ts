export interface RoleRecommendation {
  sysId: string;
  roleSysId: string;
  roleName: string;
  usageCount: number;
  recommendation: "keep" | "remove";
  disposition: "pending" | "applied" | "rejected";
  justification: string;
}

export interface SimulationResult {
  totalActions: number;
  allowedActions: number;
  blockedActions: number;
  successRatePct: number;
}

export interface PilotMetrics {
  avgRolesBeforePerUser: number;
  avgRolesAfterPerUser: number;
  sampleSize: number;
  acceptanceRatePct: number;
  rollbackRatePct: number;
}

export interface IdentitySummary {
  identity: { sysId: string; name: string };
  roles: RoleRecommendation[];
  simulation: SimulationResult;
  pilotMetrics: PilotMetrics;
}
