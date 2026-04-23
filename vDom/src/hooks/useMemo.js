import { areHookInputsEqual } from "./hookUtils.js";

export function useMemo(factory, deps) {
  const engine = window.__ENGINE__;
  const hookManager = engine.hookManager;

  const oldHook = hookManager.getOldHook();

  let hook;

  if(oldHook && areHookInputsEqual(deps, oldHook.deps)) {
    hook = hookManager.createHook({
      oldHook : oldHook
    });
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