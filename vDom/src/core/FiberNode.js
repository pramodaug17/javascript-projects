import { Lanes, mergeLane } from "../lanes/Lanes.js";

let fiberIdCounter = 0;

export class FiberNode {
  constructor({ type, props, parent = null }) {
    this.type = type;
    this.props = props || {};
    this.parent = parent;
    this.child = null;
    this.sibling = null;
    this.dom = null;
    this.alternate = null;
    this.effectTag = null;
    this.key = props?.key;
    this.hooks = [];
    this.id = fiberIdCounter++;
    this.memorized = false;
    this.effects = [];
    // DevToole releate 
    this.lanes = Lanes.NoLane;
    this.childLane = Lanes.NoLane;
  }
}

export class FiberManager {

}

export function propogateLaneToParent(fiber, lane) {
  let parent = fiber.parent;

  while (parent) {
    parent.childLane = mergeLane(parent.childLane, lane);
    parent = parent.parent;
  }
}

export function getNextFiber(fiber) {
  if(fiber.sibling) return fiber.sibling;

  let parent = fiber.parent;
  while(parent) {
    if(parent.sibling) return parent.sibling;
    parent = parent.parent;
  }

  return null;
}

export function clearFiberLanes(fiber) {
  if (!fiber) return;

  fiber.lanes = Lanes.NoLane;
  fiber.childLane = Lanes.NoLane;

  clearFiberLanes(fiber.child);
  clearFiberLanes(fiber.sibling);
}

export function propogateLaneToChild(fiber, lane) {
  let child = fiber.child;

  while (child) {
    fiber.childLane = mergeLane(fiber.childLane, chile.lanes | child.childLane)
  }
}
