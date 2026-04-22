
export const Lanes = {
    SyncLane: 1 << 0,
    DefaultLane: 1 << 1,
    IdleLane: 1 << 2
};

export function getHighestPriorityLane(lanes) {
    return lanes & -lanes;
}
