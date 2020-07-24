import React from 'react'
import { Tabs } from 'antd'
import { DatabaseOutlined, FolderOutlined } from '@ant-design/icons'

import { getLogFileList, tailLogFile } from './remote.js'
const { TabPane } = Tabs

class LogManage extends React.Component {
  state = {
    logFiles: [],
    logContent: '',
    currentLogFile: ''
  }

  componentDidMount () {
    this.loadLogFiles()
  }

  loadLogFiles = async () => {
    const response = await getLogFileList()

    const logFiles = response.data

    if (logFiles.length) {
      this.setState({
        logFiles,
        currentLogFile: logFiles[0]
      })
    }
  }

  handleLogFileChange = async key => {
    const tailed = await tailLogFile(key, 500)
    this.setState({
      logContent: tailed,
      currentLogFile: key
    })
  }

  componentWillUnmount () {

  }

  render () {
    const { currentLogFile, logFiles, logContent } = this.state
    const { handleLogFileChange } = this

    return (
      <Tabs
        onTabClick={handleLogFileChange}
        activeKey={currentLogFile}
        type='card'
        tabPosition='left'
      >
        {logFiles.map(file => (
          <TabPane
            tab={
              <span>
                <DatabaseOutlined />
                {logFiles}
              </span>
            }
            key={logFiles}
          >
            <textarea>
              {logContent}
            </textarea>
          </TabPane>
        ))}
      </Tabs>
    )
  }
}

export default LogManage
