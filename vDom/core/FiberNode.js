export class FiberNode {
    constructor({ type, props, parent = null }) {
        this.type = type;
        this.props = props;
        this.parent = parent;
        this.child = null;
        this.sibling = null;
        this.dom = null;
        this.alternate = null;
        this.effectTag = null;
        this.hooks = [];
        this.index = 0;
    }
}