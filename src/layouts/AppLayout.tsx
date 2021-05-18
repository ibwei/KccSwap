import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Header from './Header';
import { Link } from 'react-router-dom';

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

export default ({ children }: { children: JSX.Element }) => {
  return (
    <Layout>
      <Header />
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
              <Menu.Item key="1">
                <Link to="/swap">Wallet</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/addliquidity">Add Liquidity</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/farm">Farm</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
