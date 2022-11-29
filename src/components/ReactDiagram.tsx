import React from 'react';
import createEngine, {
  DefaultLabelModel,
  DefaultLinkModel,
  DefaultNodeModel,
  DiagramModel, LinkModel
} from '@projectstorm/react-diagrams';

import {
  CanvasWidget
} from '@projectstorm/react-canvas-core';


const ReactDiagram = (): JSX.Element => {

// create an instance of the engine with all the defaults
  const engine = createEngine();
// node 1
  const node1 = new DefaultNodeModel({
    name: 'Node 1',
    color: 'rgb(0,192,255)'
  });
  node1.setPosition(100, 100);
  let port1Out = node1.addOutPort('Out');
  let port1In = node1.addInPort('In');

// node 2
  const node2 = new DefaultNodeModel({
    name: 'Node 2',
    color: 'rgb(192,255,0)'
  });
  node2.setPosition(100, 300);
  let port2Out = node2.addOutPort('Out');
  let port2In = node2.addInPort('In');
// link them and with arrow
  const link1 = port1Out.link<LinkModel>(port2In);
  // link.addLabel('Hello World!');
  const model = new DiagramModel();
  model.addAll(node1, node2, link1);
  engine.setModel(model);
  return (
      <CanvasWidget engine={engine} className={'canvas'}/>
  );
};

export default ReactDiagram;