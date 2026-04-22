
let fiberIdCounter = 0;

export class FiberNode {
    constructor({ type, props, parent = null }) {
        this.type = type;
        this.props = props || {};
        this.parent = parent;
        this.child = null;
        this.sibling = null;
        this.dom = null;
        this.alternate = null;
        this.effectTag = null;
        this.key = props?.key;
        this.hooks = [];
        this.id = fiberIdCounter++;
        this.memorized = false;
        this.effects = [];
        // DevToole releate 
        this.lanes = 0;    // it is bitmask
    }
}

