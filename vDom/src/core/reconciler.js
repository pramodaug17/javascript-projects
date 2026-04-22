
import { getElementKey } from "../libs/utility.js";
import { FiberNode } from "./FiberNode.js";

export function reconcile(wipFiber, elements, deletions) {
  const oldFiber = wipFiber.alternate?.child || null;

  if (wipFiber.alternate?.props?.children === elements) {
    wipFiber.child = wipFiber.alternate.child;
    return;
  }

  let hasKeys = false;
  let temp = oldFiber;

  while(temp) {
    if(temp.key !==null) {
      hasKeys = true;
      break;
    }
    temp = temp.sibling;
  }

  const keyedOldFibers = new Map();
  

  let current = oldFiber;
  while (current) {
    keyedOldFibers.set(getElementKey(current, current.index), current);
    current = current.sibling;
  }



  let prevSibling = null;

  elements.forEach((el, index) => {
    const key = getElementKey(el, index); /// el.props?.key || index;
    const matchedOldFiber = keyedOldFibers.get(key);

    let newFiber = new FiberNode({
      type: el.type,
      props: el.props,
      parent: wipFiber
    });

    if (matchedOldFiber && el.type === matchedOldFiber.type) {
      newFiber.id = matchedOldFiber.id;
      newFiber.dom = matchedOldFiber.dom;
      newFiber.alternate = matchedOldFiber;
      newFiber.effectTag = "UPDATE";
      keyedOldFibers.delete(key);
    } else {
      newFiber.effectTag = "PLACEMENT";
    }

    newFiber.key = key;
    newFiber.index = index;

    // if (index === 0) wipFiber.child = newFiber;
    // else prevSibling.sibling = newFiber;

    if(prevSibling) {
      prevSibling.sibling = newFiber;
    } else {
      wipFiber.child = newFiber;
    }

    prevSibling = newFiber;

  });

  if (keyedOldFibers.size > 0) {
    keyedOldFibers.forEach(f => {
      f.effectTag = "DELETION";
      deletions.push(f);
    });
  }
}
