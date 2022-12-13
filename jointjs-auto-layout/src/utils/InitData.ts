import * as joint from 'jointjs';
import data from '../jsonSrc/graph3.json';

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
const addLink = (source: any, target: any, breakpoints: any) => {
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

const addMember = (name: string, x: number, y: number, type: string, id: string, size: any) => {
  // @ts-ignore
  const cell = new joint.shapes.standard[type]({
    // type: type,
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
  // if (type === "standard.Rectangle") {
  //   cell = new joint.shapes.standard.Rectangle({
  //     type: type,
  //     id: id,
  //     position: {x, y},
  //     size: size,
  //     attrs: {
  //       body: {
  //         fill: "blue"
  //       },
  //       label: {
  //         fill: "white",
  //         text: name
  //       }
  //     },
  //   });
  // } else if (type === "standard.Circle") {
  //   cell = new joint.shapes.standard.Circle({
  //     type: type,
  //     id: id,
  //     position: {x, y},
  //     size: size,
  //     attrs: {
  //       body: {
  //         fill: "blue"
  //       },
  //       label: {
  //         fill: "white",
  //         text: name
  //       }
  //     },
  //   });
  // }
  graph.addCell(cell);
  return cell;
}
const handleLogicalOperatorElements = (elements: object[], parentTask: any) => {
  console.log(elements);
  elements.forEach((element: any) => {
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

const handleLogicalOperator = (dependency: any, parentTask: any) => {
  const operator = {
    id: dependency.id,
    operator: dependency.operator
  }
  const link = {
    source: operator.id,
    target: parentTask.id,
  }
  // add the operator
  addMember(operator.id, 0, 0, "Circle", operator.id, {
    width: 40,
    height: 40
  });
  addLink(link.source, link.target, []);
  console.log(dependency.elements);
  handleLogicalOperatorElements(dependency.elements, operator);
}

const initData = (data: object[]) => {
  console.log(data);
  // (name: string, x: number, y: number, type: string, id: string)
  data.forEach((task: any) => {
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

export {
  graph,
  paper,
  initData
}