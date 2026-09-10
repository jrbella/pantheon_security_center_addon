import React from "react";
import { PositionedMember } from "../../peerFindingsTypes";

interface MemberDotProps {
  member: PositionedMember;
  isSelected: boolean;
  onHover: (e: React.MouseEvent, member: PositionedMember) => void;
  onLeave: () => void;
  onClick: (member: PositionedMember) => void;
}

export default function MemberDot({ member, isSelected, onHover, onLeave, onClick }: MemberDotProps) {
  const isOutlier = member.findings.length > 0;
  const radius = isOutlier ? (isSelected ? 8 : 6) : 3.5;
  const className = [
    "pf__dot",
    isOutlier ? "pf__dot--outlier" : "pf__dot--member",
    isSelected ? "pf__dot--selected" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <circle
      className={className}
      cx={member.x}
      cy={member.y}
      r={radius}
      onMouseEnter={e => onHover(e, member)}
      onMouseLeave={onLeave}
      onClick={() => isOutlier && onClick(member)}
      style={{ cursor: isOutlier ? "pointer" : "default" }}
    />
  );
}
