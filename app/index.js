import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import './style.css'
import ModuleManage from './ModuleManage.jsx'
import DataBaseManage from './DataBaseManage.jsx'
import SystemManage from './SystemManage.jsx'
import LogManage from './LogManage.jsx'

import { Layout, Menu, Breadcrumb } from 'antd'
import {
  DesktopOutlined,
  PieChartOutlined
} from '@ant-design/icons'

const { Content, Footer, Sider } = Layout

class SiderDemo extends React.Component {
  state = {
    menuKey: '1',
    menuName: '',
    collapsed: false
  };

  handleCollapse = collapsed => {
    this.setState({ collapsed })
  };

  renderMainContent = () => {
    if (this.state.menuKey === '0') {
      return <SystemManage />
    } else if (this.state.menuKey === '1') {
      return <ModuleManage />
    } else if (this.state.menuKey === '2') {
      return <DataBaseManage />
    } else if (this.state.menuKey === '3') {
      return <LogManage />
    }
    return <div>未配置</div>
  }

  handleMenuClicked = ({ item, key, keyPath, domEvent }) => {
    this.setState({
      menuKey: key
    })
  };

  render () {
    return (
      <Layout
        style={{ minHeight: '100vh' }}
      >
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.handleCollapse}
        >
          <div
            className='logo'
          />
          <Menu
            theme='dark'
            defaultSelectedKeys={['1']}
            onClick={this.handleMenuClicked}
            mode='inline'
          >
            <Menu.Item
              key='0'
              icon={<PieChartOutlined />}
            >系统信息
            </Menu.Item>
            <Menu.Item
              key='1'
              icon={<PieChartOutlined />}
            >模块列表
            </Menu.Item>
            <Menu.Item
              key='2'
              icon={<DesktopOutlined />}
            >数据
            </Menu.Item>
            <Menu.Item
              key='3'
              icon={<DesktopOutlined />}
            >日志
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout
          className='site-layout'
        >
          <Content
            style={{ margin: '0 16px' }}
          >
            <Breadcrumb
              style={{ margin: '16px 0' }}
            >
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div
              className='site-layout-background'
              style={{
                padding: 24,
                minHeight: 360,
                background: '#fff'
              }}
            >
              {this.renderMainContent()}
            </div>
          </Content>
          <Footer
            style={{ textAlign: 'center' }}
          >Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    )
  }
}

ReactDOM.render(<SiderDemo />, document.getElementById('app'))
