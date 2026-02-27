import axios from 'axios'
import qs from 'qs'

import type { AxiosResponse } from 'axios'
import config from './config-client'

axios.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

axios.interceptors.response.use(
    response => response,
    error => Promise.resolve(error.response),
)

/**
 * 检查HTTP响应的状态，并返回处理后的响应数据。
 * @param response - AxiosResponse对象，包含从服务器接收的完整响应信息。
 * @returns 返回一个ResponseData对象，要么是原始响应数据，要么是包含错误代码、错误消息和空数据的对象。
 */
function checkStatus(response: AxiosResponse): ResponseData<any> {
    // Validate the response object
    if (!response) {
        return {
            code: -404,
            message: '未知错误: 响应对象不存在',
            data: '',
        }
    }

    // Validate the response status
    if (response.status === 200 || response.status === 304) {
        // Validate the response data
        if (response.data) {
            return response.data
        }
        else {
            return {
                code: -404,
                message: '未知错误: 响应数据不存在',
                data: '',
            }
        }
    }

    // Return an error object with the status text or a default message
    return {
        code: -404,
        message: response.statusText || '未知错误',
        data: '',
    }
}

/**
 * 检查响应码并根据不同的响应码执行相应的操作。
 * @param res - 包含响应数据和状态码的对象。
 * @returns 返回原始的响应对象。
 */
function checkCode(res: ResponseData<any>): ResponseData<any> {
    // 根据不同的响应码重定向到不同的页面或显示消息
    if (res.code === -500) {
        window.location.href = '/backend'
    }
    else if (res.code === -400) {
        window.location.href = '/'
    }
    else if (res.code !== 200) {
        showMsg(res.message)
    }
    return res
}

/**
 * axios Api 封装
 * @returns ApiClient
 * @example
 * ```
 * get(url: '/api/url', params: {}, headers: {})
 * post(url: '/api/url', data: {}, headers: {})
 * file(url: '/api/url', data: {}, headers: {})
 * ```
 */
function api(): ApiClient {
    return {
        async file(url, data) {
            const response = await axios({
                method: 'post',
                url,
                data,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            })
            const res = checkStatus(response)
            return checkCode(res)
        },
        async post(url, data) {
            const response = await axios({
                method: 'post',
                url: config.api + url,
                data: qs.stringify(data),
                timeout: config.timeout,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
            })
            const res = checkStatus(response)
            return checkCode(res)
        },
        async get(url, params) {
            const response = await axios({
                method: 'get',
                url: config.api + url,
                params,
                timeout: config.timeout,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            })
            const res = checkStatus(response)
            return checkCode(res)
        },
    }
}

export default api()
