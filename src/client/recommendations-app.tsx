import React, { useEffect, useState, useCallback } from "react";
import RecommendationsPageLayout from "./components/recommendations/RecommendationsPageLayout";
import { getIdentitySummary } from "./services/RecommendationsService";
import { IdentitySummary, RoleRecommendation } from "./recommendationsTypes";
import "./recommendations.css";

// Demo identity: Beth Anglin (beth.anglin), the real PDI identity with the
// highest distinct effective-role count in grant_inventory -- see the
// module's delivery report for why this is well below the wireframe's
// 15-30 role target (real seed data tops out around 6-7 distinct roles).
const DEFAULT_IDENTITY_SYS_ID = "46d44a23a9fe19810012d100cca80666";

export default function RecommendationsApp() {
  const [summary, setSummary] = useState<IdentitySummary | null>(null);
  const [selected, setSelected] = useState<RoleRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const identitySysId = new URLSearchParams(window.location.search).get("identity") || DEFAULT_IDENTITY_SYS_ID;

  const load = useCallback(async () => {
    try {
      const data = await getIdentitySummary(identitySysId);
      setSummary(data);
      setSelected(prev => {
        if (prev) {
          return data.roles.find((r: RoleRecommendation) => r.sysId === prev.sysId) || null;
        }
        return data.roles.find((r: RoleRecommendation) => r.recommendation === "remove") || data.roles[0] || null;
      });
    } catch (e: any) {
      setError(e.message || "Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  }, [identitySysId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <div className="rec__status">Least-Privilege Recommendations — loading</div>;
  }

  if (error || !summary) {
    return <div className="rec__status rec__status--error">{error || "No recommendation data found"}</div>;
  }

  return (
    <RecommendationsPageLayout summary={summary} selected={selected} onSelect={setSelected} onResolved={load} />
  );
}
