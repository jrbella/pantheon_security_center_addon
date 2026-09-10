import React, { useRef, useState } from "react";
import MemberDot from "./MemberDot";
import PeerTooltip from "./PeerTooltip";
import PeerLegend from "./PeerLegend";
import { computeCanvasSize, computeClusterLayout, computeMemberPositions } from "../../utils/peerLayout";
import { PeerGroup, Member, PositionedMember, PeerTooltipData } from "../../peerFindingsTypes";

interface ClusterCanvasProps {
  groups: PeerGroup[];
  members: Member[];
  selectedSysId: string | null;
  onSelectOutlier: (member: PositionedMember) => void;
}

export default function ClusterCanvas({ groups, members, selectedSysId, onSelectOutlier }: ClusterCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ x: number; y: number; data: PeerTooltipData } | null>(null);

  const { width, height } = computeCanvasSize(groups.length);
  const clusters = computeClusterLayout(groups);

  function handleHover(e: React.MouseEvent, member: PositionedMember, groupLabel: string) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const data: PeerTooltipData =
      member.findings.length > 0
        ? { kind: "outlier", userName: member.userName, groupLabel, reasons: member.findings.map(f => f.reason) }
        : { kind: "member", userName: member.userName, groupLabel };
    setHover({ x: e.clientX - rect.left, y: e.clientY - rect.top, data });
  }

  const clearHover = () => setHover(null);

  return (
    <div className="pf__canvas" ref={containerRef}>
      <svg viewBox={`0 0 ${width} ${height}`} className="pf__svg">
        {clusters.map(cluster => (
          <g key={cluster.group.sysId}>
            <circle className="pf__cluster-boundary" cx={cluster.cx} cy={cluster.cy} r={cluster.radius} />
            <text className="pf__cluster-label" x={cluster.cx} y={cluster.cy - cluster.radius - 14}>
              {cluster.group.label}
            </text>
            <text className="pf__cluster-count" x={cluster.cx} y={cluster.cy - cluster.radius + 2}>
              {cluster.group.memberCount} members
            </text>
            {computeMemberPositions(
              members.filter(m => m.peerGroupSysId === cluster.group.sysId),
              cluster
            ).map(member => (
              <MemberDot
                key={member.sysId}
                member={member}
                isSelected={member.sysId === selectedSysId}
                onHover={e => handleHover(e, member, cluster.group.label)}
                onLeave={clearHover}
                onClick={onSelectOutlier}
              />
            ))}
          </g>
        ))}
      </svg>
      <PeerLegend />
      {hover && <PeerTooltip x={hover.x} y={hover.y} data={hover.data} />}
    </div>
  );
}
