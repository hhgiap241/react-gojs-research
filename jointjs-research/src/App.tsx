import React from 'react';
import logo from './logo.svg';
import './App.css';
import HelloWorld from "./components/HelloWorld";
import ReactDiagram from "./components/ReactDiagram";
import GoDiagram from "./components/GoDiagram";
import Graph from "./components/Graph";
import {StateDiagram} from "./components/StateDiagram";

const App = (): JSX.Element => {
  return (
    <div>
      <StateDiagram />
    </div>
  );
}

export default App;
