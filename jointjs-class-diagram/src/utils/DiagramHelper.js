import {
  portsDef,
  WFRect, WFShape_BaseColor,
  WFShape_Height, WFShape_RemoveDistance,
  WFShape_Width, WFShapeMap
} from "./ShapeDefinition";
import clone from "just-clone";
import WFUtils from "../WFUtils";
import * as joint from "jointjs";
import yaml from "js-yaml";
import * as dagre from "dagre";
import graphlib from "graphlib";

function _add(stepCount, paper, graph, setState) {
  let stepName = `Step${stepCount}`
  setState({
    stepCount: stepCount + 1,
  });

  let rect = new WFRect({
    ports: portsDef
  });
  rect.position(100, 30);
  rect.resize(WFShape_Width, WFShape_Height);
  rect.attr({
    body: {
      fill: WFShape_BaseColor
    },
    label: {
      text: stepName,
      fill: 'black'
    },
  });
  rect.addPort({ group: 'in' });
  rect.addPort({ group: 'out' });
  rect.addTo(graph);
  rect.set('wf', {
    [stepName]: {
      'call': ''
    }
  });

  /**
   * Add a handler for the context menu.
   */
  paper.findViewByModel(rect).on('element:contextmenu', (e) => {
    setState({
      contextShowMenu: true,
      mouse: { x: e.clientX, y: e.clientY },
      menuElement: rect,
      wf: clone(rect.get('wf'))
    });
  });

  /*
   * Add a handler for the settings menu on a double click.
   */
  paper.findViewByModel(rect).on('element:pointerdblclick', (e) => {
    setState({
      settingsShowDialog: true,
      menuElement: rect,
      wf: clone(rect.get('wf'))
    });
  });
  return rect;
} // _add

function _setLayoutDirection(direction, setState) {
  if (direction === 'LR') {
    portsDef.groups['in'].position = 'left';
    portsDef.groups['out'].position = 'right';
    portsDef.groups['out-condition'].position = 'right';

  } else if (direction === 'TB') {
    portsDef.groups['in'].position = 'top';
    portsDef.groups['out'].position = 'bottom';
    portsDef.groups['out-condition'].position = 'bottom';
  } else {
    throw new Error(`Unknown layoutDirection: ${direction}`)
  }

  setState({ layoutDirection: direction });
} // _setDirection

function _menuClose(setState) {
  setState({ contextShowMenu: false });
} // _menuClose

function _deleteElement(menuElement, setState) {
  menuElement.remove(); // Delete the JointJS element that is the current menu selection from the graph.
  _menuClose(setState);
} // _deleteElement

// here
function _duplicateElement(stepCount, paper, graph, setState, menuElement) {
  const newElement = _add(stepCount, paper, graph, setState);
  //newElement.set('wf', clone(this.state.menuElement.get('wf')))
  const newWf = clone(menuElement.get('wf'));
  WFUtils.setStepName(newWf, "Copy_" + WFUtils.getStepName(newWf))
  _setElementFromWF(newElement, newWf);
  _menuClose();
} // _duplicateElement

function _setElementFromWF(jjsElement, wf) {
  let type = WFUtils.getStepType(wf);
  let originalWf = jjsElement.get('wf'); // Save the original WF value
  jjsElement.set('wf', wf);
  jjsElement.attr('icon/text', WFShapeMap[type].icon);
  let stepName = WFUtils.getStepName(wf);
  jjsElement.attr('label/text', stepName);

  // We need to check that the output port types are correct for the given WF type.
  // * Other than "switch" - A single output port of type "out"
  // * "switch" - As many output ports of type "out-condition" as there are conditions in the switch
  let originalType = WFUtils.getStepType(originalWf);
  if (type !== "switch" && originalType === "switch") {
    jjsElement.resize(WFShape_Width, WFShape_Height);
  }
  if (type === "return" && originalType !== "return") {
    // Need to end up with no output ports of any type
    let outPorts = jjsElement.getGroupPorts("out");
    jjsElement.removePorts(outPorts);
    outPorts = jjsElement.getGroupPorts("out-condition");
    jjsElement.removePorts(outPorts);
  } else if (type !== "return" && type !== "switch" && originalType === "return") {
    jjsElement.addPort({ group: 'out' });
  } else if (type === "switch" && originalType !== "switch") {
    // Delete all "out" ports and add condition ports
    const outPorts = jjsElement.getGroupPorts("out");
    jjsElement.removePorts(outPorts);
    const conditions = WFUtils.getConditions(wf);
    conditions.forEach((condition) => {
      jjsElement.addPort({ id: condition.condition, group: 'out-condition', attrs: { text: { text: condition.condition } } });
    });
    jjsElement.resize(WFShape_Width, WFShape_Height + 10 * conditions.length);
  } else if (type !== "switch" && originalType === "switch") {
    // Delete all ports and add one normal output port
    const outPorts = jjsElement.getGroupPorts("out-condition");
    jjsElement.removePorts(outPorts);
    jjsElement.addPort({ group: 'out' });
  } else if (type === "switch" && originalType === "switch") {
    // We need to check and see if new ports have been added or old ports removed
    const newConditions = WFUtils.getConditions(wf);
    const oldConditions = WFUtils.getConditions(originalWf);
    let dirty = false;
    if (oldConditions.length !== newConditions.length) {
      dirty = true;
    } else {
      for (let i = 0; i < oldConditions.length; i++) {
        if (oldConditions[i].condition !== newConditions[i].condition) {
          dirty = true;
          break;
        }
      }
    }
    if (dirty) {
      const outPorts = jjsElement.getGroupPorts("out-condition");
      jjsElement.removePorts(outPorts);
      newConditions.forEach((condition) => {
        jjsElement.addPort({ id: condition.condition, group: 'out-condition', attrs: { text: { text: condition.condition } } });
      });
      jjsElement.resize(WFShape_Width, WFShape_Height + 10 * newConditions.length);
    }
  }
}

/**
 * Called when the settings OK button has been clicked.
 * @param {*} wf
 */
function _settingsOk(wf, setState, menuElement) {
  setState({ settingsShowDialog: false });
  _setElementFromWF(menuElement, wf)
  _menuClose();
} // _settingsOk

function _settingsCancel(wf, setState) {
  setState({ settingsShowDialog: false });
  _menuClose();
} // _settingsCancel

function _dumpElement(menuElement) {
  console.dir(menuElement.get('wf'));
  console.dir(menuElement);
} // _dumpElement


function _deleteAll(graph) {
  // Delete all elements
  const allCells = graph.getCells();
  graph.removeCells(allCells);
}

/**
 * Given a YAML Object as input, create the correct graph.
 * @param {*} yamlObj
 */
function _parseWF(yamlObj, graph, paper, stepCount, setState) {
  const addLink = (source, target) => {
    const link = new joint.shapes.standard.Link();
    link.source(source);
    link.target(target);
    link.addTo(graph);
    const linkView = link.findView(paper);
    linkView.addTools(new joint.dia.ToolsView({ tools: [new joint.linkTools.Remove({ distance: WFShape_RemoveDistance })] }));
    linkView.hideTools();
  };
  _deleteAll();
  // We create an element for each step in the YAML.
  yamlObj.forEach((wp) => {
    const element = _add(stepCount, paper, graph, setState);
    _setElementFromWF(element, wp);
  });
  // Now all the elements are in place, we can start wiring them up!
  yamlObj.forEach((wp) => {
    const stepName = WFUtils.getStepName(wp);
    const content = WFUtils.getStepContent(wp);
    const stepType = WFUtils.getStepType(wp);

    if (stepType !== 'switch') {
      const targetStepName = content.next;
      console.log(`Create link from ${stepName} to ${targetStepName}`)
      if (targetStepName && targetStepName !== 'end') {
        const sourceElement = _getElementFromStepName(stepName);
        const targetElement = _getElementFromStepName(targetStepName);
        const sourcePort = sourceElement.getGroupPorts("out")[0];
        const targetPort = targetElement.getGroupPorts("in")[0];
        addLink({ id: sourceElement.id, port: sourcePort.id }, { id: targetElement.id, port: targetPort.id });
        /*
        const link = new joint.shapes.standard.Link();
        link.source({ id: sourceElement.id, port: sourcePort.id });
        link.target({ id: targetElement.id, port: targetPort.id });
        link.addTo(this.graph);
        const linkView = link.findView(this.paper);
        linkView.addTools(new joint.dia.ToolsView({ tools: [new joint.linkTools.Remove({distance: WFShape_RemoveDistance})]}));
        linkView.hideTools();
        */
      }
    } // End Not switch
    else {
      /*
      This is a switch
      - Step3:
          switch:
          - condition: ew
            next: Step5
          - condition: re
            next: Step6
          - condition: fdf

          The switch algorithm is more interesting.  What we need to do is grab the switch entry which
          is an array of {condition, next} and use each of the "nexts" as the target
  */
      const conditions = content.switch;
      const sourceElement = _getElementFromStepName(stepName);
      //console.dir(sourceElement.getGroupPorts("out-condition"));
      conditions.forEach((condition) => {
        const targetStepName = condition.next;
        if (targetStepName) {
          const sourcePortId = condition.condition;
          const targetElement = _getElementFromStepName(targetStepName);
          const targetPort = targetElement.getGroupPorts("in")[0];
          //console.log(`Forming switch link from port "${portId}" to ${targetStepName}`);
          addLink({ id: sourceElement.id, port: sourcePortId }, { id: targetElement.id, port: targetPort.id });
          /*
          const link = new joint.shapes.standard.Link();
          link.source({ id: sourceElement.id, port: sourcePortId });
          link.target({ id: targetElement.id, port: targetPort.id });
          link.addTo(this.graph);
          const linkView = link.findView(this.paper);
          linkView.addTools(new joint.dia.ToolsView({ tools: [new joint.linkTools.Remove({distance: WFShape_RemoveDistance})]}));
          linkView.hideTools();
          */
        }
      });
    } // End ... this is a switch
  });
  _layout();
}

function _getElementFromStepName(stepName, graph) {
  const foundElement = graph.getElements().find((element) => {
    const wf = element.get('wf');
    if (!wf) {
      return false;
    }
    if (WFUtils.getStepName(wf) === stepName) {
      return true;
    }
    return false;
  });
  return foundElement;
}

/**
 * Build the final Workflow JSON for the solution
 */
function _buildWF(graph, setState) {
  // Iterate over each of the WF shapes
  const elements = graph.getElements();
  console.log(elements);
  console.log(graph.getLinks());
  const completeWF = [];
  elements.forEach((element) => {
    const wf = clone(element.get('wf'));

    const stepType = WFUtils.getStepType(wf);
    if (stepType !== "switch") {
      // Now we need to see what it links to!
      const neighbors = graph.getNeighbors(element, {
        outbound: true
      })
      console.assert(neighbors.length < 2);
      if (neighbors.length === 1) {
        const nextWF = neighbors[0].get('wf');
        const nextStepName = WFUtils.getStepName(nextWF);
        WFUtils.getStepContent(wf).next = nextStepName;
      } else {
        if (stepType !== "return") {
          WFUtils.getStepContent(wf).next = "end";
        }
      }
    } else {
      // It IS a switch!!!  We now need to get all the conditions in the WF and see if they are linked!
      const conditions = WFUtils.getConditions(wf);
      const connectedLinks = graph.getConnectedLinks(element, { outbound: true });
      conditions.forEach((condition) => {
        // Condition is an object that contains {condition, next}
        const conditionLink = connectedLinks.find((link) => {
          if (link.source().port === condition.condition) {
            return true;
          }
          return false;
        });
        if (conditionLink) {
          const targetElement = conditionLink.getTargetElement();
          const targetWF = targetElement.get('wf');
          condition.next = WFUtils.getStepName(targetWF);
        }
      });
    }
    completeWF.push(wf);
  });
  const y = yaml.dump(completeWF);
  console.log(y)
  setState({ yamlText: y, yamlOutputShowDialog: true })
} // _buildWF


/**
 * Layout the graph.
 */
function _layout(layoutDirection, graph) {
  let rankDir = 'LR';
  if (layoutDirection === 'TB') {
    rankDir = 'TB';
  }
  joint.layout.DirectedGraph.layout(graph, {
    dagre,
    graphlib,
    nodeSep: 50,
    edgeSep: 80,
    rankDir,
    marginX: 50,
    marginY: 50
  });
  console.log("Laid out!");
} // _layout

export {
  _add,
  _setLayoutDirection,
  _menuClose,
  _deleteElement,
  _duplicateElement,
  _setElementFromWF,
  _settingsOk,
  _settingsCancel,
  _dumpElement,
  _deleteAll,
  _parseWF,
  _getElementFromStepName,
  _buildWF,
  _layout
}