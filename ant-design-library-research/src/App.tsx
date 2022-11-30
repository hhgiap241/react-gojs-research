import React from 'react';
import logo from './logo.svg';
import './App.css';
// import "antd/dist/antd.css";
import Todo from "./components/Todo";

function App() {
  return (
    <div className={'container mx-auto p-5'}>
      <Todo />
    </div>
  );
}

export default App;
