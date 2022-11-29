import React from 'react';
import data from '../jsonSrc/graph3.json';
import data2 from '../jsonSrc/data.json';
import data3 from '../jsonSrc/original_data.json';
import InitData from "../utils/InitData";
import InitDiagram from "../utils/InitDiagram";
import {ReactDiagram} from "gojs-react";

InitData.init(data2);
console.log(InitData.getNodeDataArray());
console.log(InitData.getLinkDataArray());
const Graph = (): JSX.Element => {
  return (
      <div>
        <ReactDiagram
            initDiagram={InitDiagram.initDiagram}
            divClassName='diagram-component'
            nodeDataArray={InitData.getNodeDataArray()}
            linkDataArray={[
              // {key: -1, from: 'B2', to: 'B1'},
              // {key: -2, from: 'A1', to: 'B2'},
              // {key: -3, from: 'A2', to: 'B2'}
            ]}
            // onModelChange={handleModelChange}
        />
      </div>
  );
};

export default Graph;