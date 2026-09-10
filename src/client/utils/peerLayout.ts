import { PeerGroup, Member, ClusterLayout, PositionedMember } from "../peerFindingsTypes";

const CELL_SIZE = 320;
const MARGIN = 60;
const MIN_RADIUS = 55;
const MAX_RADIUS = 130;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export function computeCanvasSize(groupCount: number): { width: number; height: number; cols: number } {
  const cols = Math.max(1, Math.ceil(Math.sqrt(groupCount)));
  const rows = Math.max(1, Math.ceil(groupCount / cols));
  return {
    cols,
    width: cols * CELL_SIZE + MARGIN * 2,
    height: rows * CELL_SIZE + MARGIN * 2
  };
}

// One cluster per peer group, arranged in a grid so clusters never overlap
// regardless of relative size. Radius scales by sqrt(member_count) against
// the largest group, so cluster AREA is roughly proportional to headcount
// (a bubble-chart convention) rather than radius scaling linearly.
export function computeClusterLayout(groups: PeerGroup[]): ClusterLayout[] {
  const { cols } = computeCanvasSize(groups.length);
  const maxCount = Math.max(1, ...groups.map(g => g.memberCount));

  return groups.map((group, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = MARGIN + col * CELL_SIZE + CELL_SIZE / 2;
    const cy = MARGIN + row * CELL_SIZE + CELL_SIZE / 2 + 16;
    const radius = MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * Math.sqrt(group.memberCount / maxCount);
    return { group, cx, cy, radius };
  });
}

// Deterministic hash so a member's position is stable across reloads without
// outliers systematically landing at the same radius (which a sort would
// produce, since phyllotaxis index i maps directly to distance from center).
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// Packs a peer group's members inside its cluster circle using a phyllotaxis
// (sunflower-seed) spiral -- a simple, dependency-free way to fill a circle
// evenly without overlap math or a force-directed layout library.
export function computeMemberPositions(members: Member[], cluster: ClusterLayout): PositionedMember[] {
  const ordered = [...members].sort((a, b) => hashString(a.userSysId) - hashString(b.userSysId));
  const n = ordered.length;

  return ordered.map((member, i) => {
    const r = cluster.radius * Math.sqrt((i + 0.5) / n);
    const theta = i * GOLDEN_ANGLE;
    return {
      ...member,
      x: cluster.cx + r * Math.cos(theta),
      y: cluster.cy + r * Math.sin(theta)
    };
  });
}
