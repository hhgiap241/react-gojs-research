import dagre from 'dagre';
import graphlib from 'graphlib';
import * as joint from 'jointjs';
import React, {useEffect, useRef, useState} from 'react';
import './AutoLayout.css';
import jsonObject from '../jsonSrc/jointjs_sample.json';
import * as InitData from '../utils/InitData';
import data from "../jsonSrc/original_data.json";
import svgPanZoom from 'svg-pan-zoom';

let initData = InitData.initData(data);

const AutoLayout = (): JSX.Element => {
  const graphRef = useRef<joint.dia.Graph | null>(null);
  const paperRef = useRef<joint.dia.Paper | null>(null);
  const canvas: any = useRef(null);

  useEffect(() => {
    // const graph = new joint.dia.Graph({}, {cellNamespace: joint.shapes});
    const graph = initData.graph;

    const paper = new joint.dia.Paper({
      model: graph,
      background: {
        color: '#F8F9FA',
      },
      frozen: true,
      async: true,
      sorting: joint.dia.Paper.sorting.APPROX,
      cellViewNamespace: joint.shapes,
      width: '100%',
      height: '100%',
      gridSize: 20,
    });


    graphRef.current = graph;
    paperRef.current = paper;

    joint.layout.DirectedGraph.layout(graph, {
      graphlib: graphlib,
      dagre: dagre,
    });

    paper.unfreeze();
    InitData.zoompaper(paper);
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
      });
      console.log(initData.graph.toJSON());
      console.log(graphRef.current.toJSON());
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