
export function shallowEqual(objA, objB) {
  // Check is both objects are same
  if(objA === objB) return true;

  // check if any of the object is null | undefined
  if( !objA || !objB ) return false;

  // checks keys and their values
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  // checking number of keys if not equal then return false
  if( keysA.length !== keysB.length ) return false;

  // checking values of each key if length is same
  for( let key of keysA ) {
    if( objA[key] !== objB[key0] ) return false; 
  }

  // if you came here, then it means objects are matched
  return true;
}

export function getElementKey(element, index) {
  return element?.key ?? element?.props?.key ?? index;
}

export function removeFiberDom(fiber, parentDom) {
  if(!fiber) return;

  if(fiber.dom) {
    if(fiber.dom.parentNode === parentDom) {
      console.log("Deleting...: ", fiber.dom);
      console.log("Parent: ", parentDom);
      console.log("Actual parent: ", fiber.dom?.parentNode);
      parentDom.removeChild(fiber.dom);
    }
  } else {
    removeFiberDom(fiber.child, parentDom);
  }

  removeFiberDom(fiber.sibling, parentDom);
}