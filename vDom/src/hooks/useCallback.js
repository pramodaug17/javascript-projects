import { areHookInputsEqual } from "./hookUtils.js";

export function useCallback(callback, deps) {
  const engine = window.__ENGINE__;
  const hookManager = engine.hookManager;

  const oldHook = hookManager.getOldHook();

  let hook;

  if (oldHook && areHookInputsEqual(deps, oldHook.deps)) {
    oldHook.deps = oldHook.state
    hook = hookManager.createHook({
      oldHook: oldHook
    });
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