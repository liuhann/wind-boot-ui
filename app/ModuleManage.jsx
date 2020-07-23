import React from 'react'
import { Table, Col, Row, Card, Button, Modal, Input, Badge, List, message, Tabs } from 'antd'
import { searchNpmByName, getSystemModules, getHotModules, undeployHotModule, installUpdateModule, searchPackagesByName } from './remote'

const { Search } = Input
const { TabPane } = Tabs

class ModuleManage extends React.Component {
    state = {
      modules: [],
      hotModules: [],
      modelSearchVisible: false,
      modelSearchPackages: [],
      modelNpmSearchPackages: [],
      moduleVersions: {},
      moduleUpdating: {},
      moduleName: ''
    }

    columns = [{
      title: '模块名称',
      dataIndex: 'description',
      key: 'description'
    }, {
      title: '',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '当前版本',
      dataIndex: 'version',
      key: 'version'
    }, {
      title: '最新版本',
      key: 'latest',
      dataIndex: 'name',
      render: (name, record) => (
        <span>
          {this.state.moduleVersions[name]}
        </span>
      )
    }];

    hotModuleColumns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '类型',
      dataIndex: 'type',
      key: 'type'
    }, {
      title: '版本',
      dataIndex: 'version',
      key: 'version'
    }, {
      dataIndex: 'name',
      key: 'remove',
      render: (name, record) => (
        <>
          <Button
            danger
            onClick={() => this.removeModule(name)}
          >删除
          </Button>
        </>
      )
    }, {
      dataIndex: 'name',
      key: 'update',
      render: (name, record) => (
        <>
          {this.state.moduleVersions[name] && this.state.moduleVersions[name] !== record.version &&
            <Badge dot>
              <Button
                loading={this.state.moduleUpdating[name]}
                onClick={() => this.updateModule(name)}
              >更新到{this.state.moduleVersions[name]}
              </Button>
            </Badge>}
        </>
      )
    }];

    componentDidMount () {
      this.loadModule()
    }

    loadModule = async () => {
      const response = await getSystemModules()
      const hotModules = await getHotModules()

      this.setState({
        hotModules: hotModules.data,
        modules: response.data
      })

      await this.checkModuleVersions(hotModules.data.concat(response.data).map(m => m.name))
    }

    updateModule = async name => {
      this.state.moduleUpdating[name] = true

      this.setState({
        moduleUpdating: this.state.moduleUpdating
      })

      await installUpdateModule(name)

      const hotModules = await getHotModules()

      this.state.moduleUpdating[name] = false

      this.setState({
        hotModules: hotModules.data,
        moduleUpdating: this.state.moduleUpdating
      })
    }

    checkModuleVersions = async names => {
      const moduleVersions = {}
      const moduleUpdating = {}

      for (const name of names) {
        const packageInfo = await searchNpmByName(name)

        if (packageInfo.data) {
          moduleVersions[name] = packageInfo.data['dist-tags'].latest
        }
        moduleUpdating[name] = false
      }

      console.log('module versions', moduleVersions)
      this.setState({
        moduleUpdating,
        moduleVersions
      })
    }

    removeModule = async name => {
      await undeployHotModule(name)
      await this.loadModule()
    }

    installPackageByName = async name => {
      this.state.moduleUpdating[name] = true

      this.setState({
        moduleUpdating: this.state.moduleUpdating
      })

      const installResult = await installUpdateModule(name)

      this.state.moduleUpdating[name] = false
      this.state.moduleVersions[name] = ''

      this.setState({
        moduleUpdating: this.state.moduleUpdating
      })
    }

    searchPackagesByName = async name => {
      const response = await searchPackagesByName(name)
      if (response.code === '0') {
        this.setState({
          modelSearchPackages: response.data.result
        })
      } else {
        message.error('搜索异常', JSON.stringify(response))
      }

      const npmResponse = await searchNpmByName(name)

      console.log(npmResponse)
      if (npmResponse.code === '0') {
        this.setState({
          modelNpmSearchPackages: [{
            name,
            version: npmResponse.data['dist-tags'].latest,
            description: npmResponse.data.versions[npmResponse.data['dist-tags'].latest].description
          }]
        })
      } else {
        message.error('搜索异常', JSON.stringify(response))
      }
    }

    renderSearchList = list => {
      return (
        <List
          style={{
            height: '600px',
            overflow: 'auto'
          }}
          itemLayout='horizontal'
          dataSource={list}
          renderItem={item => (
            <List.Item
              key={item.name}
              actions={[!this.state.moduleVersions[item.name] &&
                <Button
                  loading={this.state.moduleUpdating[item.name]}
                  onClick={() => {
                    this.updateModule(item.name)
                  }}
                >安装
                </Button>, (this.state.moduleVersions[item.name] === item.version) && <span>已安装</span>]}
            >
              <List.Item.Meta
                title={<a>{item.name} <span>{item.version}</span></a>}
                description={item.description}
              />
            </List.Item>
          )}
        />
      )
    }

    componentWillUnmount () {
    }

    render () {
      return (
        <div>
          <Row
            gutter={16}
          >
            <Col
              span={12}
            >
              <Card
                title='内置模块'
              >
                <Table
                  rowKey='name'
                  columns={this.columns}
                  dataSource={this.state.modules}
                />
              </Card>
            </Col>
            <Col
              span={12}
            >
              <Card
                extra={
                  <Button
                    onClick={() => {
                      this.setState({
                        modelSearchVisible: true
                      })
                    }}
                  >安装
                  </Button>
                }
                title='应用模块'
              >
                <Table
                  rowKey='name'
                  columns={this.hotModuleColumns}
                  dataSource={this.state.hotModules}
                />
              </Card>
            </Col>
          </Row>
          <Modal
            title='Basic Modal'
            width='800'
            footer={null}
            onCancel={() => {
              this.setState({
                modelSearchVisible: false
              })
            }}
            visible={this.state.modelSearchVisible}
          >
            <Search
              placeholder='input search text'
              allowClear
              // onChange={this.searchPackagesByName}
              onSearch={this.searchPackagesByName}
            />
            <Tabs defaultActiveKey='asset'>
              <TabPane tab='资源中心' key='asset'>
                {this.renderSearchList(this.state.modelSearchPackages)}
              </TabPane>
              <TabPane tab='NPM官方' key='npm'>
                {this.renderSearchList(this.state.modelNpmSearchPackages)}
              </TabPane>
            </Tabs>
          </Modal>
        </div>

      )
    }
}

export default ModuleManage
