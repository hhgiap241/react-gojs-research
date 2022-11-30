import React from 'react';
import logo from './logo.svg';
import './App.css';
import HelloWorld from "./components/HelloWorld";
import ReactDiagram from "./components/ReactDiagram";
import GoDiagram from "./components/GoDiagram";
import Graph from "./components/Graph";

const App = (): JSX.Element => {
  return (
    <div>
      <Graph />
    </div>
  );
}

export default App;
