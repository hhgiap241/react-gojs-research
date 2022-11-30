import React, {useState} from 'react';
import "./Home.css";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined, MenuFoldOutlined, MenuUnfoldOutlined, QuestionCircleOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {FloatButton, Layout, Menu} from 'antd';
import Todo from "./Todo";

const {Header, Content, Footer, Sider} = Layout;
const age: any = null;

const items: MenuProps['items'] = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  CloudOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`,
}));

const SecondHomePage = (): JSX.Element => {
  const [collapsed, setCollapsed] = useState(false);
  return (
      <>
        <Layout hasSider>
          <Sider trigger={null} collapsible collapsed={collapsed}
                 style={{
                   overflow: 'auto',
                   height: '100vh',
                   position: 'fixed',
                   left: 0,
                   top: 0,
                   bottom: 0,
                 }}
          >
            <div className="logo"/>
            <Menu theme="dark"
                  mode="inline"
                  defaultSelectedKeys={['1']}
                  onClick={(e) => console.log(e)}
                  items={items}/>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{padding: 0}}>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
              })}
            </Header>
            <Content
                className="site-layout-background"
                style={{
                  margin: '24px 0px 24px 16px',
                  padding: 24,
                  minHeight: 280,
                }}>
              <div className="site-layout-background" style={{padding: 24, textAlign: 'center'}}>
                <p>long content</p>
                {
                  // indicates very long content
                  Array.from({length: 100}, (_, index) => (
                      <React.Fragment key={index}>
                        {index % 20 === 0 && index ? 'more' : '...'}
                        <br/>
                      </React.Fragment>
                  ))
                }
              </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
          </Layout>
        </Layout>
        <FloatButton.Group shape="circle">
          <FloatButton icon={<QuestionCircleOutlined/>}/>
          <FloatButton.BackTop/>
        </FloatButton.Group>
      </>
  );
}

export default SecondHomePage;