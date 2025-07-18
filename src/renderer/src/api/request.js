
import { Message } from '@arco-design/web-vue';
// // import store from '../store';
import router from '../router/index';

import instance from '@renderer/api/index'
import {useAuthStore} from '@renderer/stores'

// 请求拦截
instance.interceptors.request.use(config => {
    // 只要不是login都要验签(token)
    if (!config.url.includes('login')) {
        // const { useAuthStore } = import('@renderer/stores/index.js');
        const authStore = useAuthStore();
        console.log("!!!!!!!!!!!!!!!!!!",authStore)
        config.headers.authorization = authStore.user.data.token;
        config.headers.id = authStore.user.userId
        config.headers.username = authStore.user.username
    }
    return config;
}, error => {
    return Promise.reject(error);
})
// 响应拦截
instance.interceptors.response.use(response => {
    const resCode = response.status;
    if (resCode === 200) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(response);
    }
}, error => {
    const resCode = error.response?.status || 500;

    switch (resCode) {
        case 401:
            Message.error({
                message: '权限不足',
                description: '你没有登录，或者权限不足，请登录！'
            });
            setTimeout(() => {
                router.push({ name: 'Login' });
            }, 2000);
            break;
        case 403:
            Message.error({
                message: '权限不足',
                description: '管理员禁止此项操作！'
            });
            setTimeout(() => {
                router.back();
            }, 2000);
            break;
        case 404:
            Message.error('网络请求不存在');
            break;
        case 500:
            Message.error('服务器连接错误');
            break;
        default:
            Message.error(error.response?.data?.message || '未知错误');
    }

    return Promise.reject(error);
});

export function BackendUrl() {
    return instance.defaults.baseURL;
}

// 添加token信息，访问后端提供的静态资源
export function GetStaticSource(url, param) {
    const authStore = useAuthStore();
    const token = authStore.user.data.token;
    return instance.defaults.baseURL + url + param + "?token=" + token;
}