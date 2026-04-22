import { areHookInputsEqual } from "./hookUtils.js";

export function useMemo(factory, deps) {
  const engine = window.__ENGINE__;
  const hookManager = engine.hookManager;

  const oldHook = hookManager.getOldHook();

  let hook;

  if(oldHook && areHookInputsEqual(deps, oldHook.deps)) {
    // reuse previous value
    //hook = hookManager.createHook(oldHook.state, oldHook.queue, oldHook.deps );
    hook = {
      state: oldHook.state,
      deps: oldHook.deps
    };
  } else {
    // recompute
    const value = factory();
    hook = hookManager.createHook({
      oldHook : null,
      initial: value
    });
    hook.deps = deps;
  }

  hookManager.pushHook(hook);

  return hook.state;
}