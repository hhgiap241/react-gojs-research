import React, {useEffect, useRef} from 'react';
// @ts-ignore
import dagre from 'dagre';
// @ts-ignore
import graphlib from 'graphlib';
import {dia, shapes} from 'jointjs';
import './AutoLayout.css';
import * as joint from "jointjs";

const AutoLayout = (): JSX.Element => {
  const canvas: any = useRef(null);
  useEffect(() => {
    const graph = new dia.Graph({}, {cellNamespace: shapes});
    const paper = new dia.Paper({
      model: graph,
      background: {
        color: '#F8F9FA',
      },
      frozen: true,
      async: true,
      sorting: dia.Paper.sorting.APPROX,
      cellViewNamespace: shapes
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


    // graph.addCell(rect);
    paper.unfreeze();
    canvas.current.appendChild(paper.el);

    return () => {
      paper.remove();
    };

  }, []);

  const handleAutoLayout = () => {
    console.log('Auto Layout');
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