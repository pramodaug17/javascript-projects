
import { getHighestPriorityLane, includesSomeLanes, mergeLane, removeLane } from "./Lanes.js";

export class LaneManager {
  constructor() {
    this.pendingLanes = 0;
  }

  addLane(lane) {
    this.pendingLanes = mergeLane(this.pendingLanes, lane);
  }

  getNextLane() {
    return getHighestPriorityLane(this.pendingLanes);
  }

  removeLane(lane) {
    this.pendingLanes = removeLane(this.pendingLanes, lane);
  }

  hasWork() {
    return this.pendingLanes !== 0;
  }

  includesSomeLanes(lane) {
    return includesSomeLanes(this.pendingLanes, lane);
  }
}
