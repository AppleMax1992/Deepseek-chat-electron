import URLS from '@renderer/api/url'

import {Get, Post, Delete, Put} from "@renderer/api/request";

export default {

    postData: (params) => {
        return Post(URLS.USER_ADD_URL, params);
    },

    deleteData: (params) => {
        return Delete(URLS.USER_REMOVE_URL, params);
    },

    deleteDataBatch: (params) => {
        return Delete(URLS.USER_REMOVE_BATCH_URL, params);
    },

    postUserLogin: (data) => {
        return Post(URLS.USER_LOGIN_URL, data);
    },

    getUserList: (params) => {
        return Get(URLS.ALL_USER_URL, params);
    },

    getUser: (params) => {
        return Post(URLS.USER_INFO_URL, params);
    },

    updateUser: (params) => {
        return Put(URLS.USER_UPDATE_URL, params);
    },

    updateUserByAdmin: (params) => {
        return Put(URLS.ADMIN_UPDATE_USER_URL, params);
    },

    addUserAvatar: (params) => {
        return Post(URLS.USER_ADD_AVATAR_URL, params)
    },

    changeRole: (params) => {
        return Put(URLS.USER_CHANGE_ROLE_URL, params);
    },

    blockUser: (params) => {
        return Get(URLS.BLOCK_USER_URL, params);
    },

    checkUserLogin: (params) => {
        return Get(URLS.CHECK_USER_LOGIN_URL, params);
    },

    resetUserPassword: (params) => {
        return Post(URLS.RESET_USER_PWD_URL, params)
    }
}

