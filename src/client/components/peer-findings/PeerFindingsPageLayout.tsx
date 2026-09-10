import React, { useState } from "react";
import ClusterCanvas from "./ClusterCanvas";
import SummaryStats from "./SummaryStats";
import OutlierDetailPanel from "./OutlierDetailPanel";
import { PeerGroup, Member, PositionedMember } from "../../peerFindingsTypes";

interface PeerFindingsPageLayoutProps {
  groups: PeerGroup[];
  members: Member[];
}

export default function PeerFindingsPageLayout({ groups, members }: PeerFindingsPageLayoutProps) {
  const [selected, setSelected] = useState<PositionedMember | null>(null);

  return (
    <div className="pf-page">
      <header className="pf-page__header">
        <h1>Peer-group anomaly detection</h1>
      </header>
      <div className="pf-page__body">
        <div className="pf-page__main">
          <ClusterCanvas groups={groups} members={members} selectedSysId={selected?.sysId || null} onSelectOutlier={setSelected} />
        </div>
        <aside className="pf-page__sidebar">
          <SummaryStats groups={groups} members={members} />
          <OutlierDetailPanel selected={selected} groups={groups} />
        </aside>
      </div>
    </div>
  );
}
