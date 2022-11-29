import React from 'react';
import InitData from "../utils/InitData";
import InitDiagram from "../utils/InitDiagram";
import {ReactDiagram} from "gojs-react";

console.log(InitData.getNodeDataArray());
console.log(InitData.getLinkDataArray());
const Graph = (): JSX.Element => {
  return (
      <div>
        <ReactDiagram
            initDiagram={InitDiagram.initDiagram}
            divClassName='diagram-component'
            nodeDataArray={InitData.getNodeDataArray()}
            linkDataArray={InitData.getLinkDataArray()}
            // onModelChange={handleModelChange}
        />
      </div>
  );
};

export default Graph;