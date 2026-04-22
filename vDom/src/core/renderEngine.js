
import { FiberNode } from "./FiberNode.js";
import { reconcile } from "./reconciler.js";
import { updateDom } from "./dom.js";
import { Lanes } from "../lanes/Lanes.js";
import { hasStateUpdate } from "../hooks/hookUtils.js";

export class RendererEngine {
  constructor(renderer) {
    this.renderer = renderer;
    this.nextUnitOfWork = null;
    this.wipRoot = null;
    this.currentRoot = null;
    this.deletions = [];
    this.wipFiber = null;
    this.hookIndex = 0;
    this.currentLane = 0;
  }

  prepareFreshStack() {
    const currentRoot = this.currentRoot;

    this.wipRoot = new FiberNode({
      type: "ROOT",
      props: { children: [this.rootElement] }
    });

    if(currentRoot) {
      this.wipRoot.id = currentRoot.id;
    }

    this.wipRoot.dom = currentRoot.dom;
    this.wipRoot.alternate = currentRoot;

    this.nextUnitOfWork = this.wipRoot;
    this.deletions = [];
  }

  render(element, container, lane) {
    this.rootElement = element
    this.wipRoot = new FiberNode({
      type: "ROOT",
      dom: container,
      props: { children: [element] }
    });

    // FIX 3 
    this.wipRoot.dom = container;
    this.wipRoot.alternate = this.currentRoot;

    this.nextUnitOfWork = this.wipRoot;
    this.deletions = [];

    this.scheduler.scheduleUpdate(Lanes.SyncLane);
  }

  performUnitOfWork(fiber) {
    fiber.lanes |= this.currentLane;
    if (typeof fiber.type === "function") {
      const isMemo = fiber.type.__isMemo;

      if (
        isMemo && 
        fiber.alternate &&
        shallowEqual(fiber.props, fiber.alternate.props) &&
        !hasStateUpdate(fiber)
      ) {
        // SKIP render
        fiber.child = fiber.alternate.child;
        return null;z
      }

      // normal rendering
      this.wipFiber = fiber;
      this.hookIndex = 0;
      fiber.hooks = [];
      fiber.effects = [];

      const result = fiber.type(fiber.props);
      const children = Array.isArray(result) ? result: [result];
      
      reconcile(fiber, children, this.deletions);
    } else {
      if (!fiber.dom) {
        fiber.dom =
          fiber.type === "TEXT_ELEMENT"
            ? document.createTextNode(fiber.props.nodeValue)
            : this.renderer.createElement(fiber.type);

        updateDom(fiber.dom, {}, fiber.props);
      }

      reconcile(fiber, fiber.props.children || [], this.deletions);
    }

    if (fiber.child) return fiber.child;

    let next = fiber;
    while (next) {
      if (next.sibling) return next.sibling;
      next = next.parent;
    }

    return null;
  }

  commitRoot() {
    // DOM Update
    this.commitWork(this.wipRoot.child);

    // Deletions
    this.deletions.forEach(f => this.commitDeletion(f));

    // Swap tress
    this.currentRoot = this.wipRoot;

    // Run Effects
    this.runEffects(this.wipRoot.child);

    // Clean ups
    this.wipRoot = null;

    /////----------- DevTool notification ----------
    if (this.onCommit) this.onCommit();
    // console.log("Hurray!! Commit Phase completed");
  }

  commitWork(fiber) {
    if (!fiber) return;

    let parentFiber = fiber.parent;
    while (parentFiber && !parentFiber.dom) parentFiber = parentFiber.parent;

    if (fiber.effectTag === "PLACEMENT" && fiber.dom !== null) {
      if(!parentFiber?.dom) return;
      
      parentFiber.dom.appendChild(fiber.dom);
      this.emitDevToolEvent("PLACEMENT", fiber);
    }
    if (fiber.effectTag === "UPDATE" && fiber.dom !== null){
      updateDom(fiber.dom, fiber.alternate.props, fiber.props);
      this.emitDevToolEvent("UPDATE", fiber);
    }

    this.commitWork(fiber.child);
    this.commitWork(fiber.sibling);
  }

  commitDeletion(fiber) {
    let parentFiber = fiber.parent;
    while (parentFiber && !parentFiber.dom) {
      parentFiber = parentFiber.parent;
    }

    const parentDom = parentFiber?.dom;

    if (fiber.dom) {
      this.emitDevToolEvent("DELETION", fiber);
      parentDom.removeChild(fiber.dom);
    } else if (fiber.child) {
      this.commitDeletion(fiber.child);
    }
  }

  runEffects(fiber) {
    if(!fiber) return;

    // Execute the child effect first
    this.runEffects(fiber.child);

    if(fiber.effects) {
      fiber.effects.forEach(({hook, oldHook}) => {

        // Clean up previous
        if (oldHook && oldHook.cleanup) {
          console.log("Running cleanup..");
          oldHook.cleanup();
        }

        //run new effect
        const cleanup = hook.effect();

        hook.cleanup = typeof cleanup === 'function'
          ? cleanup
          : null;

      });
    }

    // Now execute the siblings effects
    this.runEffects(fiber.sibling);
  }


  ///--------------------------- DevTool Releted Methods -------------------------------------------
  emitDevToolEvent(type, fiber) {
    if(window.__DEVTOOLS__) {
      window.__DEVTOOLS__.onFiberCommit(type, fiber);
    }
  }
}

