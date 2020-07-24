import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8080/api/control',
  timeout: 1200000,
  withCredentials: true
})

const getSystemModules = async () => {
  const response = await instance.get('/package/system/list')

  return response.data
}

const getDbList = async () => {
  const response = await instance.get('/database/list')

  return response.data
}

const getDbCollections = async dbName => {
  const { data } = await instance.get(`/database/${dbName}/collections`)

  return data
}

const getSystemInfo = async () => {
  const { data } = await instance.get('/os')

  return data
}

const getHotModules = async () => {
  const { data } = await instance.get('/package/hot/list')

  return data
}

const undeployHotModule = async (name) => {
  const { data } = await instance.get('/package/uninstall?name=' + name)

  return data
}

const installUpdateModule = async name => {
  const { data } = await instance.get('/package/install?name=' + name)

  return data
}

const searchPackagesByName = async name => {
  const { data } = await instance.get(`/package/searchname?name=${name}`)
  return data
}

const searchNpmByName = async name => {
  const { data } = await instance.get(`/package/info?name=${name}`)
  return data
}

const restartServer = async () => {
  const { data } = await instance.get('/restart')

  return data
}

const getCollectionDocuments = async (dbName, collName, page = 1, pageSize = 20) => {
  await instance.get(`/database/collection/restful?db=${dbName}&coll=${collName}`)
  const { data } = await instance.get(`http://localhost:8080/api/restful/${dbName}/${collName}?skip=${(page - 1) * pageSize}&limit=${pageSize}`)
  return data
}

const getLogFileList = async () => {
  const { data } = await instance.get('/log/list')

  return data
}

const tailLogFile = async (file, lines) => {
  const { data } = await instance.get(`/log/tail?file=${file}&lines=${lines}`)

  return data
}

export {
  getSystemInfo,
  getSystemModules,
  getHotModules,
  undeployHotModule,
  installUpdateModule,
  getDbList,
  searchPackagesByName,
  searchNpmByName,
  getCollectionDocuments,
  restartServer,
  getDbCollections,
  getLogFileList,
  tailLogFile
}
