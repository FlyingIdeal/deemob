// 流量管理接口
import axios from '@/libs/api.request'
import qs from 'qs'

/**
 * 获取媒体列表
 * @param {Object} param - 参数
 */
export const getMediaList = (data) => {
    return axios.request({
        method: 'get',
        url: `/api/v1/user_dev/list?${qs.stringify(data, {arrayFormat: 'repeat'})}`
    })
}

/**
 * 给开发者用户重置密码
 * @param {Object} param - 参数
 */
export const mediaResetPwd = (data) => {
    return axios.request({
        method: 'put',
        url: '/api/v1/user_dev/reset_pwd',
        data
    })
}

/**
 * 开发者 - 注册
 * @param {Object} param - 参数
 */
export const mediaRegister = (data) => {
    return axios.request({
        url: '/api/v1/user_dev/register',
        method: 'post',
        data
    })
}

/**
 * 获取应用的信息
 * @param {Object} param - 参数
 */
export const getPlatformInfoApi = (data) => {
    return axios.request({
        method: 'get',
        url: `/api/v1/app/info?${qs.stringify(data)}`
    })
}


/**
 * 管理平台  广告位管理
 * 提交广告位配置信息
 * @param {Object} param - 参数
 */
export const submitControlApi = (data) => {
    return axios.request({
        method: 'put',
        url: '/api/v1/ssp_slot/set_control',
        data
    })
}


/**
 * 管理平台  广告位管理 保存广告位
 * @param {Object} param - 参数
 */
export const updateSspSlot = (data) => {
    return axios.request({
        method: 'put',
        url: '/api/v1/ssp_slot/update',
        data
    })
}


/**
 * 管理平台  广告位管理 广告位状态变更
 * @param {Object} param - 参数
 */
export const getDspHistory = (data) => {
  return axios.request({
    method: 'get',
    url: `/api/v1/ssp_slot/dsp_map_history?${qs.stringify(data, {arrayFormat: 'repeat'})}`
  })
}
