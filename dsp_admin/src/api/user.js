import axios from '@/libs/api.request'
import { APIUrl, xlsAPIUrl } from '@/libs/env.api'
import qs from 'qs'

/**
 * 登录接口
 * @param {Object} param - 当前登录者的用户信息
 */
export const verifySession = (data) => {
    return axios.request({
        method: 'get',
        url: `/uc_api/v1/user/session_verify?${qs.stringify(data)}`
    })
}
/**
 * 登录接口
 * @param {Object} param - 参数
 */
export const getLogin = (data) => {
    return axios.request({
        method: 'POST',
        url: `/uc_api/v1/user/login`,
        data
    })
}
/**
 * 注销登录
 * @param {Object} param - 参数
 */
export const logOut = (data) => {
    return axios.request({
        url: `/uc_api/v1/user/logout?${qs.stringify(data)}`,
        method: 'get'
    })
}
/**
 * [获取伪登陆token]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export const getShamLoginToken = (data) => {
    return axios.request({
        method: 'GET',
        url: `/uc_api/v1/user/get_sham_login_token?${qs.stringify(data)}`
    })
}
/**
 * 获取验证码
 * @param {Object} param - 参数
 */
export const getCaptchaCode = () => {
    return axios.request({
        url: `/uc_api/v1/base/get_captcha`,
        method: 'get'
    })
}
/**
 * resetPassword
 * @param {Object} param - 重置密码
 */
export const resetPassword = (data) => {
    return axios.request({
        method: 'patch',
        url: `/uc_api/v1/user/change_pwd`,
        data
    })
}
