export class HookManager {
    constructor(engine) {
        this.engine = engine;
        this.wipFiber = null;
        this.hookIndex = 0;
    }
    useState(initialValue) {
        const hook = { state: initialValue };
        const setState = (newValue) => {
            hook.state = typeof newValue === "function" ? newValue(hook.state) : newValue;
            this.engine.render(this.engine.currentRoot.props.children[0], this.engine.currentRoot.dom);
        };
        this.wipFiber.hooks.push(hook);
        this.hookIndex++;
        return [hook.state, setState];
    }
}