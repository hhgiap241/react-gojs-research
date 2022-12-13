import dagre from 'dagre';
import graphlib from 'graphlib';
import * as joint from 'jointjs';
import React, {useEffect, useRef} from 'react';
import './AutoLayout.css';
import {dia} from "jointjs";
const AutoLayout = (): JSX.Element => {
  const graphRef = useRef<joint.dia.Graph | null>(null);
  const canvas: any = useRef(null);
  useEffect(() => {
    const graph = new joint.dia.Graph({}, {cellNamespace: joint.shapes});
    graphRef.current = graph;
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


    var rect = new joint.shapes.standard.Rectangle();
    rect.position(100, 30);
    rect.resize(100, 40);
    rect.attr({
      body: {
        fill: 'blue'
      },
      label: {
        text: 'Hello',
        fill: 'white'
      }
    });
    rect.addTo(graph);

    var rect2 = rect.clone();
    rect2.translate(300, 0);
    rect2.attr('label/text', 'World!');
    rect2.addTo(graph);

    var rect3 = rect.clone();
    rect3.translate(600, 0);
    rect3.attr('label/text', 'World!');
    rect3.addTo(graph);

    var link = new joint.shapes.standard.Link();
    link.source(rect);
    link.target(rect2);
    link.addTo(graph);

    var link2 = new joint.shapes.standard.Link();
    link2.source(rect);
    link2.target(rect3);
    link2.addTo(graph);

    joint.layout.DirectedGraph.layout(graph, {
      graphlib: graphlib,
      dagre: dagre,
      setLinkVertices: true,
    });

    // graph.addCell(rect);
    paper.unfreeze();
    canvas.current.appendChild(paper.el);

    return () => {
      paper.remove();
    };

  }, []);

  const handleAutoLayout = () => {
    console.log('Auto Layout');
    if (graphRef.current) {
      joint.layout.DirectedGraph.layout(graphRef.current, {
        graphlib: graphlib,
        dagre: dagre,
        setLinkVertices: true,
      });
    }
  }

  return (
      <>
        <h1>Auto layout</h1>
        <div className="canvas" ref={canvas}/>
        <button onClick={handleAutoLayout}>Auto Layout</button>
      </>
  );
};

export default AutoLayout;