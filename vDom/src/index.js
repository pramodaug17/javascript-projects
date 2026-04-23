
import { createElement } from "./core/createElement.js";
import { RendererEngine } from "./core/renderEngine.js";
import { DOMRenderer } from "./core/dom.js";
import { Scheduler } from "./core/scheduler.js";
import { LaneManager } from "./lanes/LaneManager.js";
import { HookManager } from "./hooks/HookManager.js";
import { Lanes } from "./lanes/Lanes.js";
import { DevTools } from "./devtools/DevTools.js";
import { useMemo } from "./hooks/useMemo.js";
import { useCallback } from "./hooks/useCallback.js";
import { useEffect } from "./hooks/useEffect.js";
import { useState } from "./hooks/useState.js";

const laneManager = new LaneManager();
const renderer = new DOMRenderer();
const engine = new RendererEngine(renderer);
const scheduler = new Scheduler(engine, laneManager);

engine.scheduler = scheduler;
engine.laneManager = laneManager;

const hookManager = new HookManager(engine);
engine.hookManager = hookManager;

const devtools = new DevTools(engine,laneManager);
engine.onCommit = ()=>devtools.update();

window.__ENGINE__ = engine;
window.createElement=createElement;
window.render=(el,container,lane=Lanes.DefaultLane)=>
    engine.render(el,container,lane);

window.useState = (...args) => useState(...args);
window.useMemo = useMemo;
window.useCallback = useCallback;
window.useEffect = useEffect;

//window.Lanes = Lanes;

// FIX 2 force intial rendering DevTool
devtools.update();
