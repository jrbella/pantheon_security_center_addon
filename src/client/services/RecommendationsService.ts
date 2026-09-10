import { IdentitySummary } from "../recommendationsTypes";

const API_BASE = "/api/x_1906124_pantheon/recommendations";

async function apiCall(path: string, options: RequestInit = {}): Promise<any> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-UserToken": (window as any).g_ck,
      ...(options.headers || {})
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || `Request failed: ${response.status}`);
  }
  return body.result !== undefined ? body.result : body;
}

export async function getIdentitySummary(identitySysId: string): Promise<IdentitySummary> {
  const params = new URLSearchParams({ identity: identitySysId });
  return apiCall(`/identity/summary?${params}`);
}

export async function applyRecommendation(recommendationSysId: string, justification: string): Promise<any> {
  return apiCall("/apply", {
    method: "POST",
    body: JSON.stringify({ recommendationSysId, justification })
  });
}

export async function rejectRecommendation(recommendationSysId: string, justification: string): Promise<any> {
  return apiCall("/reject", {
    method: "POST",
    body: JSON.stringify({ recommendationSysId, justification })
  });
}
