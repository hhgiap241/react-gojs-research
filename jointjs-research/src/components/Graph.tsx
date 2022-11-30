import React, {useEffect} from 'react';
import InitData from "../utils/InitData";
import InitDiagram from "../utils/InitDiagram";
import {ReactDiagram} from "gojs-react";
import * as go from 'gojs';
import {UndoManager} from "gojs";

console.log(InitData.getNodeDataArray());
console.log(InitData.getLinkDataArray());
const Graph = (): JSX.Element => {

  const resetDiagramBtnHandler = (): void => {
    console.log("resetDiagramBtnHandler");
  }

  return (
      <div>
        <ReactDiagram
            initDiagram={InitDiagram.initDiagram}
            divClassName='diagram-component'
            nodeDataArray={InitData.getNodeDataArray()}
            linkDataArray={InitData.getLinkDataArray()}
            // onModelChange={handleModelChange}
        />
        <button onClick={resetDiagramBtnHandler}>Reset Diagram</button>
      </div>
  );
};

export default Graph;