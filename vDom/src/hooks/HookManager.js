

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
  }

  pushHook(newHook) {
    this.engine.wipFiber.hooks.push(newHook);
    this.engine.hookIndex++;

    return newHook;
  }
}
