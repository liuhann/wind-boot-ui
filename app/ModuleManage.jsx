import React from 'react';
import { Table, Col, Row, Card, Button, Modal, Input, Badge, List, message } from 'antd';
import { getSystemModules, getHotModules, undeployHotModule, getPackageInfo, installUpdateModule, searchPackagesByName } from './remote';

const { Search } = Input;

class ModuleManage extends React.Component {
    state = {
        modules: [],
        hotModules: [],
        modelSearchVisible: false,
        modelSearchPackages: [],
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
        key: 'name',
        render: (name, record) => (
            <>
                <Button
                    danger
                    onClick={() => this.removeModule(name)}>删除</Button>
            </>
        )
    }, {
        dataIndex: 'name',
        key: 'name',
        render: (name, record) => (
            <>
                {this.state.moduleVersions[name] && this.state.moduleVersions[name] !== record.version && <Badge
                    dot>
                    <Button
                        loading={this.state.moduleUpdating[name]}
                        onClick={() => this.updateModule(name)}>
                                更新到{this.state.moduleVersions[name]}
                    </Button>
                </Badge>}
            </>
        )
    }];

    componentDidMount() {
        this.loadModule();
    }

    loadModule = async() => {
        const response = await getSystemModules(),
            hotModules = await getHotModules();

        this.setState({
            hotModules: hotModules.data,
            modules: response.data
        });

        await this.checkModuleVersions(hotModules.data.concat(response.data).map(m => m.name));
    }

    updateModule = async name => {
        this.state.moduleUpdating[name] = true;

        this.setState({
            moduleUpdating: this.state.moduleUpdating
        });

        await installUpdateModule(name);

        const hotModules = await getHotModules();

        this.state.moduleUpdating[name] = false;

        this.setState({
            hotModules: hotModules.data,
            moduleUpdating: this.state.moduleUpdating
        });
    }

    checkModuleVersions = async names => {
        const moduleVersions = {},
            moduleUpdating = {};

        for (const name of names) {
            const packageInfo = await getPackageInfo(name);

            if (packageInfo.data && packageInfo.data.versionData) {
                moduleVersions[name] = packageInfo.data.versionData.version;
            }
            moduleUpdating[name] = false;
        }

        this.setState({
            moduleUpdating,
            moduleVersions
        });
    }

    removeModule = async name => {
        await undeployHotModule(name);
        await this.loadModule();
    }

    installPackageByName = async name => {
        this.state.moduleUpdating[name] = true;

        this.setState({
            moduleUpdating: this.state.moduleUpdating
        });

        const installResult = await installUpdateModule(name);

        this.state.moduleUpdating[name] = false;
        this.state.moduleVersions[name] = '';

        this.setState({
            moduleUpdating: this.state.moduleUpdating
        });
    }

    searchPackagesByName = async name => {
        const result = await searchPackagesByName(name);

        if (result.code === '0') {
            this.setState({
                modelSearchPackages: result.data
            });
        } else {
            message.error('搜索异常', JSON.stringify(result));
        }
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div>
                <Row
                    gutter={16}>
                    <Col
                        span={12}>
                        <Card
                            title="内置模块">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.modules} />
                        </Card>
                    </Col>
                    <Col
                        span={12}>
                        <Card
                            extra={<Button
                                onClick={() => {
                                    this.setState({
                                        modelSearchVisible: true
                                    });
                                }}>安装</Button>}
                            title="应用模块">
                            <Table
                                columns={this.hotModuleColumns}
                                dataSource={this.state.hotModules} />
                        </Card>
                    </Col>
                </Row>
                <Modal
                    title="Basic Modal"
                    width="800"
                    footer={null}
                    onCancel={() => {
                        this.setState({
                            modelSearchVisible: false
                        });
                    }}
                    visible={this.state.modelSearchVisible}
                >
                    <Search
                        placeholder="input search text"
                        allowClear
                        onChange={this.searchPackagesByName}
                        onSearch={this.searchPackagesByName}
                    />
                    <List
                        style={{
                            height: '600px',
                            overflow: 'auto'
                        }}
                        itemLayout="horizontal"
                        dataSource={this.state.modelSearchPackages}
                        renderItem={item => (
                            <List.Item
                                actions={[!this.state.moduleVersions[name] && <Button
                                    loading={this.state.moduleUpdating[item.name]}
                                    key={item.name}
                                    onClick={() => {
                                        this.updateModule(item.name);
                                    }}>安装</Button>, (this.state.moduleVersions[name] === item.version) && <span>已安装</span>]}>
                                <List.Item.Meta
                                    title={<a>{item.name} <span>{item.version}</span></a>}
                                    description={item.description}
                                />
                            </List.Item>
                        )}
                    />
                </Modal>
            </div>

        );
    }
}

export default ModuleManage;
