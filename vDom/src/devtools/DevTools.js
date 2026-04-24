
export class DevTools {
  constructor(engine, laneManager) {
    this.engine = engine;
    this.laneManager = laneManager;
    this.panel = this.createPanel();
    this.selectedFiberId = null;

    if(!window.__DEVTOOLS__) {
      window.__DEVTOOLS__ = {};
    }
      
    window.__DEVTOOLS__.onFiberCommit = this.onFiberCommit.bind(this);

  }

  onFiberCommit(type, fiber) {
    if(!fiber.dom) return;

    this.highlightedDOM(fiber.dom, type);
  }

  createPanel() {
    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.right = "0";
    panel.style.top = "0";
    panel.style.width = "300px";
    panel.style.height = "100%";
    panel.style.background = "#111";
    panel.style.color = "rgb(150, 228, 150)";
    panel.style.fontSize = "12px";
    panel.style.overflow = "auto";
    panel.style.padding = '10px';

    document.body.appendChild(panel);
    return panel;
  }

  update() {
    this.panel.innerHTML = `
            <h3>Mini React DevTools</h3>
            <div>Lanes: ${this.engine.scheduler.currentLane.toString(2)}</div>
            <div>Pending Lanes: ${this.laneManager.pendingLanes.toString(2)}</div>
            <hr/>
            <div id="fiberTree"></div>
            <hr/>
            <div id="fiberDetails"></div>
        `;

    const treeContainer = this.panel.querySelector("#fiberTree");
    this.renderFiberTree(this.engine.currentRoot, treeContainer);

    this.renderDetails();
  }

  renderFiberTree(fiber, container, depth = 0) {
    if (!fiber) return "";

    const node = document.createElement("div");
    node.style.marginLeft = depth * 10 + "px";
    node.stylecursor = "pointer";

    const laneStr = fiber.lanes ? fiber.lanes.toString(2) : "0";
    const childLaneStr = fiber.childLanes ? fiber.childLanes.toString(2) : "0";

    let name = fiber.type?.name || fiber.type;
    node.textContent = `${name} (lanes: ${laneStr}, childLane: ${childLaneStr})`;

    node.onclick = () => {
      this.selectedFiberId = fiber.id;
      this.update();
    };

    container?.appendChild(node);

    this.renderFiberTree(fiber.child, container, depth + 1);
    this.renderFiberTree(fiber.sibling, container, depth);

  }

  renderDetails() {
    const details = this.panel.querySelector("#fiberDetails");
    const fiber = this.findFiberById(this.engine.currentRoot, this.selectedFiberId);

    if (this.selectedFiberId === null) {
      details.innerHTML = "<i>Select a fiber</i>";
      return;
    }
    if(!fiber) {
      details.innerHTML = "<i>Select a fiber</i><br/>Selected Fiber is not valid";
      return;
    }

    details.innerHTML = `
      <h4>Fiber Details</h4>
      <div><b>Type:</b>${fiber.type?.name || fiber.type}</div>
      <div><b>Key:</b>${fiber.key ?? "None"}</div>
      <div><b>Props:</b><pre>${JSON.stringify(fiber.props, null,2)}</pre></div>
      <div><b>Hooks:</b>${fiber.hooks?.map(h=>h.state).join(",") || "none"} </div>
      <div><b>Has DOM: </b>${!!fiber.dom}</div>
      <div><b>Lane:</b>${fiber.lanes.toString(2)}</div>
    `;
  }

  findFiberById(root, targetId) {
    let node = root;

    while (node) {
      if(node.id === targetId) {
        return node;
      }

      if ( node.child ) {
        const found = this.findFiberById(node.child, targetId);
        if (found) return found;
      }

      node = node.sibling;
    }
  }

  highlightedDOM(dom, type) {
    let color;

    switch (type) {
      case "PLACEMENT":
        color = 'green';
        break;
      case "UPDATE":
        color = 'orange'
        break;
      case "DELETION":
        color = 'red';
        break;
      default:
        color = 'blue';
    }

    const prev = dom.style?.outline || "";

    if(dom.style) dom.style.outline = `2px solid ${color}`;

    setTimeout(() => {
      if(dom.style) dom.style.outline = prev || "";
    }, 300);
  }
}
