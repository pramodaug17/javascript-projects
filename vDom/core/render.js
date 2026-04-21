import { FiberNode } from "./FiberNode.js";
import { Reconciler } from "./Reconciler.js";
export class RendererEngine {
    constructor(renderer) {
        this.renderer = renderer;
        this.nextUnitOfWork = null;
        this.wipRoot = null;
        this.currentRoot = null;
    }
    render(element, container) {
        this.wipRoot = new FiberNode({
            dom: container,
            props: { children: [element] }
        });
        this.nextUnitOfWork = this.wipRoot;
        requestIdleCallback(this.workLoop.bind(this));
    }
    workLoop(deadline) {
        let shouldYield = false;
        while (this.nextUnitOfWork && !shouldYield) {
            this.nextUnitOfWork = this.performUnitOfWork(this.nextUnitOfWork);
            shouldYield = deadline.timeRemaining() < 1;
        }
        if (!this.nextUnitOfWork && this.wipRoot) {
            this.commitRoot();
        }
        requestIdleCallback(this.workLoop.bind(this));
    }
    performUnitOfWork(fiber) {
        if (typeof fiber.type === "function") {
            this.updateFunctionComponent(fiber);
        } else {
            this.updateHostComponent(fiber);
        }
        if (fiber.child) return fiber.child;
        let nextFiber = fiber;
        while (nextFiber) {
            if (nextFiber.sibling) return nextFiber.sibling;
            nextFiber = nextFiber.parent;
        }
        return null;
    }
    updateFunctionComponent(fiber) {
        window.hookManager.wipFiber = fiber;
        window.hookManager.hookIndex = 0;
        fiber.hooks = [];
        const children = [fiber.type(fiber.props)];
        Reconciler.reconcileChildren(fiber, children);
    }
    updateHostComponent(fiber) {
        if (!fiber.dom) {
            fiber.dom =
                fiber.type === "TEXT_ELEMENT"
                    ? document.createTextNode("")
                    : this.renderer.createElement(fiber.type);
            Object.entries(fiber.props || {}).forEach(([key, value]) => {
                if (key !== "children") fiber.dom[key] = value;
            });
        }
        Reconciler.reconcileChildren(fiber, fiber.props.children || []);
    }
    commitRoot() {
        this.commitWork(this.wipRoot.child);
        this.currentRoot = this.wipRoot;
        this.wipRoot = null;
    }
    commitWork(fiber) {
        if (!fiber) return;
        let parentFiber = fiber.parent;
        while (!parentFiber.dom) {
            parentFiber = parentFiber.parent;
        }
        const parentDom = parentFiber.dom;
        if (fiber.dom) parentDom.appendChild(fiber.dom);
        this.commitWork(fiber.child);
        this.commitWork(fiber.sibling);
    }
}