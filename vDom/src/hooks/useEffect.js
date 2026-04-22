import { areHookInputsEqual } from "./hookUtils.js";

export function useEffect(effect, deps) {
  const engine = window.__ENGINE__;
  const hookManager = engine.hookManager;

  const oldHook = hookManager.getOldHook();

  let hasChanged = true;
  let hook;

  if(oldHook && oldHook.deps) {
    hasChanged = !areHookInputsEqual(deps, oldHook.deps);
  }

  if(hasChanged) {
    hook = hookManager.createHook({
      oldHook: null,
      initila: null, 
      deps: deps
    });
    hook.effect = effect;
  } else {
    hook = hookManager.createHook({
      oldHook : oldHook
    });
    hook.cleanup = oldHook.cleanup;
  } 

  hookManager.pushHook(hook);

  if(hasChanged) {
    engine.wipFiber.effects = engine.wipFiber.effects || [];
    engine.wipFiber.effects.push({
      hook,
      oldHook
    });
  }

}