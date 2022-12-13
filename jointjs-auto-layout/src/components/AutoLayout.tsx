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
    paper.on('blank:mousewheel', function(evt, x, y, delta) {
      evt.preventDefault();
      const oldscale = paper.scale().sx;
      const newscale = oldscale + 0.2 * delta * oldscale

      if (newscale>0.2 && newscale<5) {
        paper.scale(newscale, newscale, 0, 0);
        // @ts-ignore
        paper.translate(-x*newscale+evt.offsetX,-y*newscale+evt.offsetY);
      }
    });
    graphRef.current = graph;
    paperRef.current = paper;

    // var rect = new joint.shapes.standard.Circle();
    // rect.position(100, 30);
    // rect.resize(100, 40);
    // rect.attr({
    //   body: {
    //     fill: 'blue'
    //   },
    //   label: {
    //     text: 'Hello',
    //     fill: 'white'
    //   }
    // });
    // rect.addTo(graph);
    //
    // var rect2 = rect.clone();
    // rect2.translate(300, 0);
    // rect2.attr('label/text', 'World!');
    // rect2.addTo(graph);
    //
    // var rect3 = rect.clone();
    // rect3.translate(600, 0);
    // rect3.attr('label/text', 'World!');
    // rect3.addTo(graph);
    //
    // var link = new joint.shapes.standard.Link();
    // link.source(rect);
    // link.target(rect2);
    // link.addTo(graph);
    //
    // var link2 = new joint.shapes.standard.Link();
    // link2.source(rect);
    // link2.target(rect3);
    // link2.addTo(graph);

    // let the graph be horizontally and vertically centered and scaled to fit the viewport


    joint.layout.DirectedGraph.layout(graph, {
      graphlib: graphlib,
      dagre: dagre,
    });

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