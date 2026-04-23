import { Lanes } from "../lanes/Lanes.js";


export function useState(initial) {
  const engine = window.__ENGINE__;
  const hookManager = engine.hookManager;
  const oldHook = hookManager.getOldHook();

  const hook = hookManager.createHook({
    oldHook,
    initial
  });

  // FIX 5 for Hooks. Apply all queued actions
  hook.queue.forEach(action => {
    hook.state = typeof action === 'function'
      ? action(hook.state)
      : action
  });

  // FIX 5 continue clear the queue
  hook.queue = [];

  // console.log("APPLY QUEUE: ", hook.queue.length);
  const queueRef = hook.queue;

  const setState = action => {
    queueRef.push(action);

    engine.scheduler.scheduleUpdate(Lanes.DefaultLane);
  };

  hookManager.pushHook(hook);

  return [hook.state, setState];
}