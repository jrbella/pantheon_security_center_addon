import React, { useEffect, useState } from "react";
import PeerFindingsPageLayout from "./components/peer-findings/PeerFindingsPageLayout";
import { getPeerGroups, getMembersWithFindings } from "./services/PeerFindingsService";
import { PeerGroup, Member } from "./peerFindingsTypes";
import "./peer-findings.css";

export default function PeerFindingsApp() {
  const [groups, setGroups] = useState<PeerGroup[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [groupData, memberData] = await Promise.all([getPeerGroups(), getMembersWithFindings()]);
        setGroups(groupData);
        setMembers(memberData);
      } catch (e: any) {
        setError(e.message || "Failed to load peer group data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="pf__status">Peer-Group Anomaly Detection — loading</div>;
  }

  if (error || !groups.length) {
    return <div className="pf__status pf__status--error">{error || "No peer group data found"}</div>;
  }

  return <PeerFindingsPageLayout groups={groups} members={members} />;
}
