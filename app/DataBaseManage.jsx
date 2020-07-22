import React from 'react';
import { Tabs, Table } from 'antd';
import { DatabaseOutlined, FolderOutlined } from '@ant-design/icons';

import { getDbList, getDbCollections, getCollectionDocuments } from './remote.js';
const { TabPane } = Tabs;

class DatabaseManage extends React.Component {
  state = {
      columns: [],
      databases: [],
      dbCollections: [],
      dbname: '',
      collection: '',
      documents: [],
      page: 1,
      pageSize: 20
  }

  componentDidMount() {
      this.loadDatabases();
  }

  loadDatabases = async() => {
      const response = await getDbList();

      this.setState({
          databases: response.data
      });
  }

  onTabClick = async key => {
      const response = await getDbCollections(key);

      this.setState({
          collection: '',
          columns: [],
          documents: [],
          dbname: key,
          dbCollections: response.data
      });
  }

  onCollectionClick = async key => {
      this.setState({
          collection: key,
          page: 1,
          pageSize: 20
      });
      this.loadCollectionDocuments(key);
  }

  loadCollectionDocuments = async(collection) => {
      const { dbname, page, pageSize } = this.state,
          response = await getCollectionDocuments(dbname, collection, page, pageSize);

      if (response.data.list.length) {
          this.setState({
              columns: Object.keys(response.data.list[0]).map(key => ({
                  title: key,
                  dataIndex: key,
                  key: key
              })),
              documents: response.data.list
          });
      } else {
          this.setState({
              columns: [],
              documents: []
          });
      }
  }

  componentWillUnmount() {

  }

  render() {
      const { databases, dbCollections, documents, dbname, collection, columns } = this.state,
          { onTabClick, onCollectionClick } = this;

      return (
          <Tabs
              onTabClick={onTabClick}
              activeKey={dbname}
              type="card"
              tabPosition="left">
              {databases.map(database => (
                  <TabPane
                      tab={
                          <span>
                              <DatabaseOutlined />
                              {database}
                          </span>
                      }
                      key={database}>
                      <Tabs
                          type="card"
                          activeKey={collection}
                          onTabClick={onCollectionClick}
                          tabPosition="left">
                          {
                              dbCollections.map(coll => (
                                  <TabPane
                                      tab={
                                          <span>
                                              <FolderOutlined />
                                              {coll}
                                          </span>
                                      }
                                      key={coll}>
                                      <Table
                                          columns={columns}
                                          dataSource={documents} />
                                  </TabPane>
                              ))
                          }
                      </Tabs>
                  </TabPane>
              ))}
          </Tabs>
      );
  }
}

export default DatabaseManage;
