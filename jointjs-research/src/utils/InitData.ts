import {ObjectData} from "gojs";
import data from '../jsonSrc/graph3.json';
import data2 from '../jsonSrc/data.json';
import data3 from '../jsonSrc/original_data.json';

let x: number = 0;
let y: number = 0;
let key: number = -1;

function checkIfTaskExists(nodeDataArray: ObjectData[], task: any): boolean {
  return nodeDataArray.some((node) => node.key === task.id);
}

function addLink(linkDataArray: ObjectData[], link: any): void {
  linkDataArray.push({
    key: key--,
    from: link.from,
    to: link.to,
    fromPort: "Out",
    toPort: "In",
  });
}

function addTask(nodeDataArray: ObjectData[], task: any, properties: any): void {
  if (!checkIfTaskExists(nodeDataArray, task)) {
    x =  Math.floor(Math.random() * (1000));
    y =  Math.floor(Math.random() * (1000));
    const loc = x + " " + y;
    nodeDataArray.push({
      key: task.id,
      text: task.operator || task.id,
      // loc: loc,
      color: properties.color,
      category: properties.category,
    });
  }
}

class InitData {
  private nodeDataArray: ObjectData[];
  private linkDataArray: ObjectData[];

  constructor() {
    this.nodeDataArray = [];
    this.linkDataArray = [];
    this.init(data3);
  }
  handleLogicalOperatorElements(elements: object[], parentTask: any) {
    console.log(elements);
    elements.forEach((element: any) => {
      if (element.type === 'Task') {
        addTask(this.nodeDataArray, element, {
          loc: '0 0',
          // if the state is ok => lightgreen, pending => yellow, cancelled => red
          color: element.state === 'ok' ? 'lightgreen' : element.state === 'cancelled' ? 'red' : 'yellow',
          category: 'Task',
        });
        const link = {
          from: element.id,
          to: parentTask.id
        }
        addLink(this.linkDataArray, link);
      } else {
        this.handleLogicalOperator(element, parentTask);
      }
    });
  }
  handleLogicalOperator(dependency: any, parentTask: any){
    const operator = {
      id: dependency.id,
      operator: dependency.operator
    }
    const link = {
      from: operator.id,
      to: parentTask.id
    }
    // add the operator
    addTask(this.nodeDataArray, operator, {
      loc: '0 0',
      color: 'pink',
      category: 'LogicalOperator',
    });
    addLink(this.linkDataArray, link);
    // handle elements
    console.log(dependency.elements);
    this.handleLogicalOperatorElements(dependency.elements, operator);
  }
  init(data: object[]) {
    data.forEach((task: any, index: number) => {
      addTask(this.nodeDataArray, task, {
        loc: '0 0',
        color: 'lightgreen',
        category: 'Task',
      });
      // if task has dependencies
      if (task.dependencies) {
        const parentTask = task;
        this.handleLogicalOperator(task.dependencies, parentTask);
      }
    })
  }

  getNodeDataArray() {
    return this.nodeDataArray;
  }

  getLinkDataArray() {
    return this.linkDataArray;
  }
}

export default new InitData();