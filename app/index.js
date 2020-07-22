import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './style.css';
import ModuleManage from './ModuleManage.jsx';
import DataBaseManage from './DataBaseManage.jsx';
import SystemManage from './SystemManage.jsx';

import { Layout, Menu, Breadcrumb } from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined
} from '@ant-design/icons';

const { Content, Footer, Sider } = Layout,
    { SubMenu } = Menu;

class SiderDemo extends React.Component {
  state = {
      menuKey: '1',
      menuName: '',
      collapsed: false
  };

  onCollapse = collapsed => {
      this.setState({ collapsed });
  };

  renderMainContent = () => {
      if (this.state.menuKey === '0') {
          return <SystemManage />;
      } else if (this.state.menuKey === '1') {
          return <ModuleManage />;
      } else if (this.state.menuKey === '2') {
          return <DataBaseManage />;
      }
      return <div>未配置</div>;
  }

  menuClicked = ({ item, key, keyPath, domEvent }) => {
      this.setState({
          menuKey: key
      });
  };

  render() {
      return (
          <Layout
              style={{ minHeight: '100vh' }}>
              <Sider
                  collapsible
                  collapsed={this.state.collapsed}
                  onCollapse={this.onCollapse}>
                  <div
                      className="logo" />
                  <Menu
                      theme="dark"
                      defaultSelectedKeys={['1']}
                      onClick={this.menuClicked}
                      mode="inline">
                      <Menu.Item
                          key="0"
                          icon={<PieChartOutlined />}>
                            系统信息
                      </Menu.Item>
                      <Menu.Item
                          key="1"
                          icon={<PieChartOutlined />}>
                            模块列表
                      </Menu.Item>
                      <Menu.Item
                          key="2"
                          icon={<DesktopOutlined />}>
                          数据
                      </Menu.Item>
                      <SubMenu
                          key="sub1"
                          icon={<UserOutlined />}
                          title="User">
                          <Menu.Item
                              key="3">Tom</Menu.Item>
                          <Menu.Item
                              key="4">Bill</Menu.Item>
                          <Menu.Item
                              key="5">Alex</Menu.Item>
                      </SubMenu>
                      <SubMenu
                          key="sub2"
                          icon={<TeamOutlined />}
                          title="Team">
                          <Menu.Item
                              key="6">Team 1</Menu.Item>
                          <Menu.Item
                              key="8">Team 2</Menu.Item>
                      </SubMenu>
                      <Menu.Item
                          key="9"
                          icon={<FileOutlined />} />
                  </Menu>
              </Sider>
              <Layout
                  className="site-layout">
                  <Content
                      style={{ margin: '0 16px' }}>
                      <Breadcrumb
                          style={{ margin: '16px 0' }}>
                          <Breadcrumb.Item>User</Breadcrumb.Item>
                          <Breadcrumb.Item>Bill</Breadcrumb.Item>
                      </Breadcrumb>
                      <div
                          className="site-layout-background"
                          style={{
                              padding: 24,
                              minHeight: 360,
                              background: '#fff'
                          }}>
                          {this.renderMainContent()}
                      </div>
                  </Content>
                  <Footer
                      style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
              </Layout>
          </Layout>
      );
  }
}

ReactDOM.render(<SiderDemo />, document.getElementById('app'));
