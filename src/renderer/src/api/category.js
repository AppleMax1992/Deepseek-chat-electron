import URLS from './url'

import {Get, Post, Put, Delete} from "@renderer/api/request";

export default {
    postRelateData: (params) => {
        return Post(URLS.ADD_RELATE_URL, params);
    },
    deleteRelateData: (params) => {
        return Delete(URLS.CATE_NO_RELATE_URL, params);
    },

    getListData: (params) => {
        return Get(URLS.CATE_LIST_URL, params);
    },

    postData: (params) => {
        return Post(URLS.CATE_ADD_URL, params);
    },

    deleteData: (params) => {
        return Delete(URLS.CATE_REMOVE_URL, params);
    },
    putData: (params) => {
        return Put(URLS.CATE_UPDATE_URL, params);
    },

    getDocList: (params) => {
        return Get(URLS.QUERY_BY_CATE_URL, params);
    },

    getMyCollectList: (params) => {
        return Get(URLS.MY_COLLECT_URL, params);
    },

    getMyUploadList: (params) => {
        return Get(URLS.MY_UPLOAD_URL, params);
    },
}

