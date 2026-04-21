import { FiberNode } from './FiberNode.js';
export class Reconciler {
    static reconcileChildren(parentFiber, elements) {
        let prevSibling = null;
        elements.forEach((element, index) => {
            const newFiber = new FiberNode({
                type: element.type,
                props: element.props,
                parent: parentFiber
            });
            newFiber.effectTag = "PLACEMENT";
            newFiber.index = index;
            if (index === 0) parentFiber.child = newFiber;
            else prevSibling.sibling = newFiber;
            prevSibling = newFiber;
        });
    }
}