import React from 'react';
import logo from './logo.svg';
import './App.css';
// import 'antd/dist/reset.css';
import Todo from "./components/Todo";
import { FloatButton } from 'antd';
import {QuestionCircleOutlined, SyncOutlined} from "@ant-design/icons";
import Home from "./components/Home";

function App() {
  return (
    <div style={{height: "1000vh"}}>
      <Home />
    </div>
  );
}

export default App;
