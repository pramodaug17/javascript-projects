

export function areHookInputsEqual(nextDeps, prevDeps) {
  if(!prevDeps || !nextDeps) return null;

  if (prevDeps.length !== nextDeps.length) return false;

  for(let i = 0; i < prevDeps.length; i++) {
    if (prevDeps[i] !== nextDeps[i]) {
      return false;
    }
  }

  return true;
}

export function hasStateUpdate(fiber) {
  const oldHooks = fiber.alternate?.hooks;

  if(!oldHooks) return false;

  return oldHooks.some(hook => hook.queue && hook.queue.length > 0);
}