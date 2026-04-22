
import { getHighestPriorityLane } from "../lanes/Lanes.js"

export class Scheduler {
  constructor(engine, laneManager) {
    this.engine = engine;
    this.laneManager = laneManager;
    this.isWorking = false;
    this.currentLane = 0;
    this.isBatchScheduled = false;
  }

  scheduleUpdate(lane) {
    this.laneManager.addLane(lane);

    // batch multiple calls in same tick
    if(!this.isBatchScheduled) {
      this.isBatchScheduled = true;

      if (!this.isWorking) {
        this.isWorking = true;
        this.scheduleCallback(this.workLoop.bind(this));
      }
    }
  }

  workLoop(deadline) {
    let shouldYield = false;

    while (this.laneManager.hasWork()) {
      // const lane = this.laneManager.getNextLane();
      const nextLane = getHighestPriorityLane(this.laneManager.pendingLanes);

      /* not require as preemption should happen when task is executing
      if (this.currentLane && lane < this.currentLane) {
          this.currentLane = lane;
          this.engine.prepareFreshStack();
          break;
      }

      this.currentLane = lane;                        */

      // When starting new lane, prepare fresh stack
      if (!this.engine.nextUnitOfWork) {
        this.engine.prepareFreshStack();
      }

      while (this.engine.nextUnitOfWork && !shouldYield) {
        // Checking if any higher lane has pending task
        if (this.currentLane && lane < this.currentLane) {
          this.currentLane = lane;
          this.engine.currentLane = lane;
          this.engine.prepareFreshStack();
          shouldYield = true;
        }

        this.engine.nextUnitOfWork =
          this.engine.performUnitOfWork(this.engine.nextUnitOfWork);

        if (deadline.timeRemaining() < 1) {
          shouldYield = true;
        }
      }

      if (!this.engine.nextUnitOfWork) {
        this.engine.commitRoot();
        this.laneManager.removeLane(nextLane);
        this.currentLane = 0;
        this.isWorking = false;
        this.isBatchScheduled = false;
      }

      if (shouldYield) break;
    }

    if (this.laneManager.hasWork()) {
      if (!this.isBatchScheduled) {
        this.isBatchScheduled = true;
        this.scheduleCallback(this.workLoop.bind(this));
      }
    }
  }

  // FIX 1
  scheduleCallback(callback) {
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback((deadline) => {
        this.isBatchScheduled = false;
        callback(deadline);
      });
    } else {
      setTimeout(() => {
        this.isBatchScheduled = false;
        callback({
          timeRemaining: () => 999
        });
      }, 0);
    }
  }
}
