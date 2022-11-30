import React from 'react';
import {DatePicker, Input, Row} from "antd";

const Todo = (): JSX.Element => {
  return (
      <>
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
        <Input placeholder="Basic usage" />
        <DatePicker />
      </>
  );
};

export default Todo;