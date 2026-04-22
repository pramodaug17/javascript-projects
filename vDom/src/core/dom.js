
export class DOMRenderer {
  createElement(type) {
    return document.createElement(type);
  }
}

export function updateDom(dom, prev = {}, next = {}) {
  if (!dom) return;

  // Handling TEXT_ELEMENT hanlding
  if(dom.nodeType === Node.TEXT_NODE) {
    if(prev.nodeValue !== next.nodeValue) {
      dom.nodeValue = next.nodeValue;
    }
    return;
  }

  // Hanlding Old Events
  Object.keys(prev)
    .filter(eventName => eventName.startsWith("on"))
    .forEach(eventName => {
      const eventType = eventName.toLowerCase().substring(2);
      if (!(eventName in next))
        dom.removeEventListener(eventType, prev[eventName]);
    }
  );

  // Hanlding New Events
  Object.keys(next)
    .filter(eventName => eventName.startsWith("on"))
    .forEach(eventName => {
      if(prev[eventName] !== next[eventName]) {
        const eventType = eventName.toLowerCase().substring(2);
        if(prev[eventName]) {
          dom.removeEventListener(eventType, prev[eventName]);
        }
        dom.addEventListener(eventType, next[eventName]);
      }
    }
  );

  // Remove old other props
  Object.keys(prev)
    .filter(key => key!== 'children' && !key.startsWith("on"))
    .forEach(key => {
      if (!(key in next))
        dom[key] = "";;
    }
  );

  // Add new other props
  Object.keys(next)
    .filter(key => key.startsWith("on"))
    .forEach(key => {
      if(prev[key !== next[key]])
        dom[key] = next[key];
    }
  );
}
