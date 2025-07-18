import axios from 'axios'

const instance = axios.create({
    // baseURL: 'http://81.69.247.172:8082',
    // baseURL: 'http://81.69.247.172:8082/api/v1.0',
    baseURL: 'http://localhost:8082/api/v1.0',
    // baseURL: '/api/v1.0',
    timeout: 100000,
    headers: {
        post: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }
})

export default instance

/*
 *封装get方法
 *@param{String} url [请求地址]
 *@param{Object} params 请求参数
 */
export function Get(url, params) {
    return new Promise((resolve, reject) => {
        instance.get(url, {
            params: params
        }).then((res) => {
            resolve(res.data);
        }).catch((error) => {
            reject(error.data);
        })
    })
}

/*
 *封装get方法
 *@param{String} url [请求地址]
 *@param{Object} params 请求参数
 */
export function Download(url, config) {
    return new Promise((resolve, reject) => {
        instance.get(url, config).then((res) => {
            resolve(res.data);
        }).catch((error) => {
            reject(error.data);
        })
    })
}


/**
 *封装post方法
 *@param{String} url 请求地址
 *@param{Object} params 请求参数
 */
export function Post(url, params, config) {
    return new Promise((resolve, reject) => {
        instance.post(url, params, config).then((res) => {
            resolve(res.data);
        }).catch((error) => {
            reject(error.data);
        })
    })
}

/**
 *封装put方法
 *@param{String} url 请求地址
 *@param{Object} params 请求参数
 */
export function Put(url, params) {
    return new Promise((resolve, reject) => {
        instance.put(url, params).then((res) => {
            resolve(res.data);
        }).catch((error) => {
            reject(error.data);
        })
    })
}

/**
 *封装patch方法
 *@param{String} url 请求地址
 *@param{Object} params 请求参数
 */
export function Patch(url, params) {
    return new Promise((resolve, reject) => {
        instance.put(url, params).then((res) => {
            resolve(res.data);
        }).catch((error) => {
            reject(error.data);
        })
    })
}

/**
 *封装delete方法
 *@param{String} url [请求地址]
 *@param{Object} params [请求参数]
 */
export function Delete(url, params) {
    return new Promise((resolve, reject) => {
        instance.delete(url, {data: params}).then((res) => {
            resolve(res.data);
        }).catch((error) => {
            reject(error.data);
        })
    })
}
