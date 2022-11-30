import React from 'react';
import {ReactDiagram} from 'gojs-react';

import '../App.css';
import InitDiagram from "../utils/InitDiagram";


/**
 * This function handles any changes to the GoJS model.
 * It is here that you would make any updates to your React state, which is dicussed below.
 */
function handleModelChange(changes: any) {
  alert('GoJS model changed!');
}


// render function...
function GoDiagram() {
  return (
      <div>
        <ReactDiagram
            initDiagram={InitDiagram.initDiagram}
            divClassName='diagram-component'
            nodeDataArray={[
              {key: 'B1', text: 'B1', color: 'lightblue', loc: '0 0', category: 'Task'},
              {key: 'B2', text: 'or', color: 'pink', loc: '150 0', category: 'LogicalOperator'},
              {key: 'A1', text: 'A1', color: 'lightgreen', loc: '300 0', category: 'Task'},
              {key: 'A2', text: 'A2', color: 'lightgreen', loc: '300 150', category: 'Task'}
            ]}
            linkDataArray={[
              {key: -1, from: 'B2', to: 'B1', text: 'hihi'},
              {key: -2, from: 'A1', to: 'B2'},
              {key: -3, from: 'A2', to: 'B2'}
            ]}
            // onModelChange={handleModelChange}
        />
      </div>
  );
}

export default GoDiagram;