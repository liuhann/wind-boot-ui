import axios from 'axios';

const instance = axios.create({
        baseURL: 'http://localhost:8090/api',
        timeout: 3000,
        withCredentials: true
    }),

    getSystemModules = async() => {
        const response = await instance.get('/package/system/list');

        return response.data;
    },

    getDbList = async() => {
        const response = await instance.get('/database/list');

        return response.data;
    },

    getDbCollections = async dbName => {
        const { data } = await instance.get(`/database/${dbName}/collections`);

        return data;
    },

    getSystemInfo = async() => {
        const { data } = await instance.get('/os');

        return data;
    },

    getHotModules = async() => {
        const { data } = await instance.get('/package/hot/list');

        return data;
    },

    undeployHotModule = async(name) => {
        const { data } = await instance.get('/package/undeploy?name=' + name);

        return data;
    },

    installUpdateModule = async name => {
        const { data } = await instance.get('/package/deploy?name=' + name);

        return data;
    },

    getPackageInfo = async name => {
        const { data } = await instance.get(`/assets/info?name=${name}`);

        return data;
    },

    searchPackagesByName = async name => {
        const { data } = await instance.get(`/assets/searchname/${name}`);

        return data;
    },

    restartServer = async() => {
        const { data } = await instance.get(`/assets/searchname/${name}`);

        return data;
    },

    getCollectionDocuments = async(dbName, collName, page = 1, pageSize = 20) => {
        const { data } = await instance.get(`/database/${dbName}/${collName}/documents?skip=${(page - 1) * pageSize}&limit=${pageSize}`);

        return data;
    };

export {
    getSystemInfo,
    getSystemModules,
    getHotModules,
    getPackageInfo,
    undeployHotModule,
    installUpdateModule,
    getDbList,
    searchPackagesByName,
    getCollectionDocuments,
    getDbCollections
};
