import URLS from './url'

import {Get, Post, Put, Delete, Download} from "@renderer/api/request";

export default {

    getData: (params) => {
        return Get(URLS.DOC_DETAIL_URL, params);
    },

    getListData: (params) => {
        return Post(URLS.DOC_LIST_URL, params);
    },

    deleteData: (params) => {
        return Delete(URLS.DOC_REMOVE_URL, params);
    },

    updateData: (params) => {
        return Put(URLS.DOC_UPDATE_URL, params);
    },

    getDataWithCheck: (params) => {
        return Get(URLS.DOC_WITH_CHECK_URL, params);
    },

    // 必须登录以后进行上传
    docUpload: (param, config) => {
        return Post(URLS.DOC_UPLOAD_URL, param, config)
    },

    docUploadBatch: (param, config) => {
        return Post(URLS.DOC_UPLOAD_BATCH_URL, param, config)
    },

    docUploadByUrl: (param, config) => {
        return Post(URLS.DOC_UPLOAD_BY_URL_URL, param, config)
    },

    getView: (param) => {
        return Get(URLS.DOC_VIEW_URL + param, null)
    },

    getTxtFile: (param) => {
        return Download(URLS.DOC_TXT_URL + param, {params: {}, responseType: 'blob'})
    },

    getRebuildIndex: (param) => {
        return Get(URLS.DOC_REBUILD_URL, param);
    },

    addLike: (param) => {
        return Post(URLS.ADD_LIKE_URL, null, param)
    },

    getLikeInfo: (param) => {
        return Get(URLS.GET_LIKE_URL, param)
    },

}

