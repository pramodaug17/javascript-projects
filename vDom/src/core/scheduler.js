
import { getHighestPriorityLane } from "../lanes/Lanes.js"
import { MessageScheduler } from "./messageScheduler.js";

export class Scheduler {
  constructor(engine, laneManager) {
    this.engine = engine;
    this.laneManager = laneManager;
    this.isWorking = false;
    this.currentLane = 0;
    this.isBatchScheduled = false;
    this.deadline = 0;
    this.messageScheduler = new MessageScheduler();
  }

  scheduleUpdate(lane) {
    this.laneManager.addLane(lane);

    // Pick hihgest priority lane

    // batch multiple calls in same tick
    if(!this.isBatchScheduled) {
      this.isBatchScheduled = true;

      if (!this.isWorking) {
        this.isWorking = true;
        this.scheduleCallback(this.workLoop.bind(this));
      }
    }
  }

  workLoop() {
    let shouldYield = false;

    while (this.laneManager.hasWork()) {
      // const lane = this.laneManager.getNextLane();
      const nextLane = getHighestPriorityLane(this.laneManager.pendingLanes);

      if(!this.currentLane) {
        this.currentLane = nextLane;
        this.engine.currentLane = nextLane;
      }

      // When starting new lane, prepare fresh stack
      if (!this.engine.nextUnitOfWork) {
        this.engine.prepareFreshStack();
      }

      while (this.engine.nextUnitOfWork && !shouldYield) {
        const highPrioLane = getHighestPriorityLane(this.laneManager.pendingLanes);
        // Checking if any higher lane has pending task
        if (this.currentLane && highPrioLane !== this.currentLane) {
          this.currentLane = highPrioLane;
          this.engine.currentLane = highPrioLane;
          this.engine.prepareFreshStack();
          //shouldYield = true;
        }

        this.engine.nextUnitOfWork =
          this.engine.performUnitOfWork(this.engine.nextUnitOfWork, this.currentLane);

        shouldYield = this.messageScheduler.shouldYield();
      }

      if (!this.engine.nextUnitOfWork) {
        this.engine.commitRoot();
        this.laneManager.removeLane(nextLane);
        this.currentLane = 0;
        this.isWorking = false;
        this.isBatchScheduled = false;
      }

      if (this.shouldYield()) break;
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
    if(typeof MessageChannel !== 'undefined') {
      this.messageScheduler.schedule( () => {
        callback();
      })
    }
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback((deadline) => {
        this.isBatchScheduled = false;
        this.deadline = deadline.timeRemaining() + performance.now();
        callback();
      });
    } else {
      setTimeout(() => {
        this.isBatchScheduled = false;
        this.deadline = 999 + performance.now();
        callback();
      }, 0);
    }
  }

  shouldYield() {
    return performance.now() >= this.deadline;
  }
}
