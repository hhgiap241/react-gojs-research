import * as joint from 'jointjs';
import data from '../jsonSrc/graph3.json';
import svgPanZoom from "svg-pan-zoom";

const graph = new joint.dia.Graph({}, {cellNamespace: joint.shapes});

const paper = new joint.dia.Paper({
  model: graph,
  background: {
    color: '#F8F9FA',
  },
  frozen: true,
  async: true,
  sorting: joint.dia.Paper.sorting.APPROX,
  cellViewNamespace: joint.shapes
});
const addLink = (source, target, breakpoints) => {
  const cell = new joint.shapes.standard.Link({
    source: {id: source},
    target: {id: target},
    vertices: breakpoints,
    attrs: {
      '.connection': {
        stroke: '#333333',
        'stroke-width': 2,
      },
    }
  });
  graph.addCell(cell);
  return cell;
}

function _addNode(stepCount, paper, graph, setState, node) {
  let stepName = `Step${stepCount}`;
  setState({
    stepCount: stepCount + 1
  });

}

const addMember = (name, x, y, type, id, size) => {
  // @ts-ignore
  const cell = new joint.shapes.standard[type]({
    id: id,
    position: {x, y},
    size: size,
    attrs: {
      body: {
        fill: "blue"
      },
      label: {
        fill: "white",
        text: name
      }
    }
  });
  graph.addCell(cell);
  return cell;
}
const handleLogicalOperatorElements = (elements, parentTask) => {
  // console.log(elements);
  elements.forEach((element) => {
    if (element.type === 'Task') {
      addMember(element.id, 0, 0, "Rectangle", element.id, {
        width: 100,
        height: 40
      });
      const link = {
        source: element.id,
        target: parentTask.id
      }
      addLink(link.source, link.target, []);
    } else if (element.type === 'LogicalOperator') {
      handleLogicalOperator(element, parentTask);
    }
  });
}

const handleLogicalOperator = (dependency, parentTask) => {
  const operator = {
    id: dependency.id,
    name: dependency.operator
  }
  const link = {
    source: operator.id,
    target: parentTask.id,
  }
  // add the operator
  addMember(operator.name, 0, 0, "Circle", operator.id, {
    width: 40,
    height: 40
  });
  addLink(link.source, link.target, []);
  // console.log(dependency.elements);
  handleLogicalOperatorElements(dependency.elements, operator);
}

const initData = (data) => {
  // console.log(data);
  data.forEach((task) => {
    addMember(task.id, 0, 0, "Rectangle", task.id, {
      width: 100,
      height: 40
    });
    if (task.dependencies) {
      const parentTask = task;
      handleLogicalOperator(task.dependencies, parentTask);
    }
  });
  return {
    graph,
    paper
  }
}

const zoompaper = (paper) => {
  const panZoom = svgPanZoom(paper.svg, {
    viewportSelector: paper.layers,
    zoomEnabled: true,
    panEnabled: false,
    fit: false, // important line
    controlIconsEnabled: true,
    maxZoom: 2,
    minZoom: 0.1,
    onUpdatedCTM: (function () {
      let currentMatrix = paper.matrix();
      return function onUpdatedCTM(matrix) {
        const {a, d, e, f} = matrix;
        const {a: ca, d: cd, e: ce, f: cf} = currentMatrix;
        const translateChanged = (e !== ce || f !== cf)
        if (translateChanged) {
          paper.trigger('translate', e - ce, f - cf);
        }
        const scaleChanged = (a !== ca || d !== cd);
        if (scaleChanged) {
          paper.trigger('scale', a, d, e, f);
        }
        currentMatrix = matrix;
      }
    })()
  });

  paper.on('blank:pointerdown', function () {
    panZoom.enablePan();
  });

  paper.on('blank:pointerup', function () {
    panZoom.disablePan();
  });
}

export {
  graph,
  paper,
  initData,
  zoompaper,
}