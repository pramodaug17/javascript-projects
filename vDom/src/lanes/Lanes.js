
export const Lanes = {
  NoLane: 0b00000000,
  SyncLane: 1 << 0,
  InputLane: 1 << 1,
  DefaultLane: 1 << 2,
  IdleLane: 1 << 6
};

export function mergeLane(laneA, laneB) {
  return laneA | laneB;
}

export function includesSomeLanes(set, lane) {
  return (set & lane) !== 0;
}

export function removeLane(set, lane) {
  return set & ~lane;
}

export function getHighestPriorityLane(lanes) {
  return lanes & -lanes;
}
