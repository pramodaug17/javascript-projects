import { areHookInputsEqual } from "./hookUtils.js";

export function useCallback(callback, deps) {
  const engine = window.__ENGINE__;
  const hookManager = engine.hookManager;

  const oldHook = hookManager.getOldHook();

  let hook;

  if (oldHook && areHookInputsEqual(deps, oldHook.deps)) {
    // hook = hookManager.createHook(oldHook.state);
    // hook.deps = oldHook.deps;
    hook = {
      state: oldHook.state,
      deps: oldHook.state
    }
  } else {
    hook = hookManager.createHook({
      oldHook: null,
      initial: callback,
      deps: deps
    });
  }

  hookManager.pushHook(hook);

  return hook.state;
}