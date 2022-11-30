import React from 'react';
import {Col, DatePicker, Input, Row, Slider, Space} from "antd";

const style: React.CSSProperties = { background: '#0092ff', padding: '8px 0', textAlign: 'center', margin: '10px 0' };


const Todo = (): JSX.Element => {
  return (
      <>
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
        <Space direction={"vertical"} size="middle" style={{ display: 'flex' }}>
          <Input placeholder="Basic usage" />
          <DatePicker />
          <Slider range={true} defaultValue={[20, 50]} min={1} max={1000} step={10} tooltip={{open: true}}/>
        </Space>
        <Row>
          <Col span={24}>
            <div style={style}>col</div>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <div style={style}>col-12</div>
          </Col>
          <Col span={12}>
            <div style={style}>col-12</div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div style={style}>col-8</div>
          </Col>
          <Col span={8}>
            <div style={style}>col-8</div>
          </Col>
          <Col span={8}>
            <div style={style}>col-8</div>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <div style={style}>col-6</div>
          </Col>
          <Col span={6}>
            <div style={style}>col-6</div>
          </Col>
          <Col span={6}>
            <div style={style}>col-6</div>
          </Col>
          <Col span={6}>
            <div style={style}>col-6</div>
          </Col>
        </Row>
      </>
  );
};

export default Todo;