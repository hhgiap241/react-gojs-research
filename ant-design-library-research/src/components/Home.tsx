import React, {useState} from 'react';
import {FloatButton, Layout, Menu} from "antd";
import Sider from "antd/es/layout/Sider";
import './Home.css';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined, QuestionCircleOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined
} from "@ant-design/icons";
import {Content, Header} from "antd/es/layout/layout";
import Todo from "./Todo";

const Home = (): JSX.Element => {
  const [collapsed, setCollapsed] = useState(false);

  return (
      <>
        <Layout  style={{height: "inherit"}}>
          <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="logo"></div>
            <Menu
                theme="dark"
                mode="inline"
                onClick={(e) => console.log(e)}
                defaultSelectedKeys={['1']}
                items={[
                  {
                    key: '1',
                    icon: <UserOutlined/>,
                    label: 'nav 1',
                  },
                  {
                    key: '2',
                    icon: <VideoCameraOutlined/>,
                    label: 'nav 2',
                  },
                  {
                    key: '3',
                    icon: <UploadOutlined/>,
                    label: 'nav 3',
                  },
                ]}
            />
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
                }}
            >
              <Todo/>
            </Content>
          </Layout>
        </Layout>

        <FloatButton.Group shape="circle">
          <FloatButton icon={<QuestionCircleOutlined/>}/>
          <FloatButton.BackTop/>
        </FloatButton.Group>
      </>
  );
};

export default Home;