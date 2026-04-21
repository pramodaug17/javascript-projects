import { DOMRenderer } from "./renderer/DOMRenderer.js";
import { RendererEngine } from "./core/render.js";
import { HookManager } from "./hooks/useState.js";
import { createElement } from "./core/createElement.js";

const renderer = new DOMRenderer();
const engine = new RendererEngine(renderer);

window.hookManager = new HookManager(engine);
window.createElement = createElement;
window.render = (element, container) => engine.render(element, container);
window.useState = (...args) => window.hookManager.useState(...args);