import URLS from './url'

import {Post, Put, Delete} from "@renderer/api/index";

export default {

    getListData: (params) => {
        return Post(URLS.COMMENT_LIST_URL, params);
    },

    postData: (params) => {
        return Post(URLS.COMMENT_ADD_URL, params);
    },

    deleteData: (params) => {
        return Delete(URLS.COMMENT_REMOVE_URL, params);
    },

    deleteDataBatch: (params) => {
        return Delete(URLS.COMMENT_REMOVE_BATCH_URL, params);
    },

    getMyComments: (params) => {
        return Post(URLS.COMMENT_USER_URL, params);
    },

    getAllComments: (params) => {
        return Post(URLS.COMMENT_ALL_URL, params);
    },
}

