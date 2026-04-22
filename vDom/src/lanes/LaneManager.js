
import { getHighestPriorityLane } from "./Lanes.js";

export class LaneManager {
    constructor() {
        this.pendingLanes = 0;
    }

    addLane(lane) {
        this.pendingLanes |= lane;
    }

    getNextLane() {
        return getHighestPriorityLane(this.pendingLanes);
    }

    removeLane(lane) {
        this.pendingLanes &= ~lane;
    }

    hasWork() {
        return this.pendingLanes !== 0;
    }
}
