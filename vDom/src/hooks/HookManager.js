
import { FiberNode } from "../core/FiberNode.js";
import { Lanes } from "../lanes/Lanes.js";

export class HookManager {
  constructor(engine) {
    this.engine = engine;
  }

  getOldHook() {
    const fiber = this.engine.wipFiber;
    const oldFiber = fiber.alternate;

    if(!oldFiber || !oldFiber.hooks) return null;

    return oldFiber.hooks[this.engine.hookIndex];
  }
  
  createHook({oldHook=null, initial = null, deps = null} = {}) {
    return {
      state: oldHook ? oldHook.state : initial,
      queue: oldHook ? oldHook.queue : [],
      deps: oldHook ? oldHook.deps : deps,
      cleanup: oldHook ? oldHook.cleanup : null,
      effect: null
    };

    // this.engine.wipFiber.hooks.push(hook);
    // this.engine.hookIndex++;

    // return hook;
  }

  pushHook(newHook) {
    this.engine.wipFiber.hooks.push(newHook);
    this.engine.hookIndex++;

    return newHook;
  }

  useState(initial) {
    const oldHook = this.getOldHook();

    const hook = {
      state: oldHook ? oldHook.state : initial,
      queue: oldHook ? oldHook.queue : []
    };

    // FIX 5 for Hooks. Apply all queued actions
    hook.queue.forEach(action => {
      hook.state = typeof action === 'function'
        ? action(hook.state)
        : action
    });

    // FIX 5 continue clear the queue
    hook.queue = [];

    // const actions = oldHook ? oldHook.queue : [];
    // actions.forEach(action => {
    //   hook.state = typeof action === "function"
    //     ? action(hook.state)
    //     : action;
    // });

    console.log("APPLY QUEUE: ", hook.queue.length);
    const queueRef = hook.queue;

    const setState = action => {
      queueRef.push(action);

      /* Old implementation *//*
      const currentRoot = this.currentRoot;
      
      this.wipRoot = new FiberNode({
        type: currentRoot.type,
        props: {children: [this.rootElement] },
        //props: currentRoot.props, // dom: this.engine.currentRoot.dom,
        parent: null //this.engine.currentRoot.props
      });

      // FIX 8 important fix for re-rendering issue
      this.wipRoot.dom = currentRoot.dom;
      this.wipRoot.alternate = currentRoot;
      
      this.nextUnitOfWork = this.wipRoot;
      this.deletions = [];                        *//* Old implementation ends here */

      this.engine.scheduler.scheduleUpdate(Lanes.DefaultLane);
    };

    this.pushHook(hook);

    return [hook.state, setState];
  }
}
