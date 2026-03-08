import process from 'node:process'
import { API_KEY, APP_ID, SECRET_KEY } from './shihua.js'
import * as _qiniu from './qiniu.js'

export { cookies as tujidao } from './tujidao.js'

export { apiId as mpappApiId, secret as mpappSecret } from './mpapp.js'

export { secretClient, secretServer } from './secret.js'

// MD5 加密前缀, 如用户的密码是 123456, 存到数据库将会变成 md5('!@#$%(*&^)' + '123456')
export const md5Pre = '!@#$%(*&^)'

export const shihua = {
    APP_ID,
    API_KEY,
    SECRET_KEY,
}
export const qiniu = _qiniu

export const mongoUrl = process.env.MONGODB_URI || '0.0.0.0'

// API域名
export const domain = 'https://api.mmxiaowu.com/'
export const cdnDomain = 'http://cdn.mmxiaowu.com/'

// Coding Plan API 配置
export const DS_API_KEY = process.env.DS_API_KEY || 'sk-sp-14e207d3d0724c868b4ec7ed724f35e2'
export const DS_TARGET_API_URL = process.env.DS_TARGET_API_URL || 'https://coding.dashscope.aliyuncs.com/v1/chat/completions'

if (!DS_API_KEY && process.env.NODE_ENV === 'production') {
    console.warn('[config] DS_API_KEY is not set')
}
