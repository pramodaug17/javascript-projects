

export function memo(Component) {
  function MemorizedComponent(props) {
    return Component(props);
  }

  MemorizedComponent.__isMemo = true;
  MemorizedComponent.type = Component;  // optional for debugging

  return MemorizedComponent;
}