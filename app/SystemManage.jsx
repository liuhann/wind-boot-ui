import React from 'react';
import { Row, Col, Statistic, Button, Space, Card } from 'antd';
import { getSystemInfo, restartServer } from './remote.js';

class ModuleManage extends React.Component {
  state = {
      systemInfo: {}
  }

  componentDidMount() {
      this.loadSystemInfo();
  }

  loadSystemInfo = async() => {
      const response = await getSystemInfo();

      this.setState({
          systemInfo: response.data
      });
  }

  restartServer = async () => {
      const response = await restartServer
  }

  componentWillUnmount() {

  }

  render() {
      const { restartServer } = this;
      const { systemInfo } = this.state;

      return (
          <div>
              <Row>
                  <Col
                      span={24}><Button onClick={restartServer}>重新启动</Button></Col>
              </Row>
              <Card>              <Row>
                  <Col
                      span={6}>
                      <Statistic
                          title="可用内存"
                          value={Math.floor(systemInfo.freemem / (1024 * 1024))}
                          suffix="M" />
                      <Statistic
                          title="loadavg"
                          value={systemInfo.loadavg} />
                      <Statistic
                          title="arch"
                          value={systemInfo.arch} />
                  </Col>
                  <Col
                      span={6}><Statistic
                          title="总内存"
                          value={Math.floor(systemInfo.totalmem / (1024 * 1024))}
                          suffix="M" />
                      <Statistic
                          title="uptime"
                          value={new Date(systemInfo.uptime * 1000)} />
                      <Statistic
                          title="cpu"
                          value={systemInfo.cpus ? systemInfo.cpus.length : 0} />
                  </Col>
              </Row>
              </Card>

          </div>
      );
  }
}

export default ModuleManage;
