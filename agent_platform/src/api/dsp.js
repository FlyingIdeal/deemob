import axios from '@/libs/api.request'
import qs from 'qs'
import {APIUrl, xlsAPIUrl} from '@/libs/env.api'

// 广告主列表

/**
 * 获取广告主列表
 * getAgentList
 * @param {Object} param参数
 */
export const getAdvertiserList = (data) => {
    return axios.request({
        url: `/api/v1/advertiser/list?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
        method: 'get'
    })
}

/**
 * 获取广告主列表 导出使用
 * @param {Object} param参数
 */
export const getAdvertiserListUrl = (data) => {
    return `${APIUrl.agentComUrl}/api/v1/advertiser/list?${qs.stringify(data, {arrayFormat: 'repeat'}).replace(/%3A/g, ':')}`
}

/**
 * 新建广告主
 * @param {Object} param参数
 */
export const addNewAdvertiser = (data) => {
    return axios.request({
        method: 'post',
        url: '/api/v1/advertiser/new',
        data
    })
}

/**
 * 修改广告主信息
 * @param {Object} param参数
 */
export const modifyAdvertiser = (data) => {
    return axios.request({
        method: 'post',
        url: '/api/v1/advertiser/mod',
        data
    })
}

/**
 * 修改广告主结算系数
 * @param {Object} param参数
 */
export const modifyAdvPricex = (data) => {
    return axios.request({
        method: 'post',
        url: '/api/v1/advertiser/price_x/mod',
        data
    })
}

/**
 * 修改广告主密码
 * @param {Object} param
 */
export const resetAdvertiserPsw = (data) => {
    return axios.request({
        method: 'post',
        url: `/api/v1/advertiser/password/reset`,
        data
    })
}

/**
 * 批量修改广告主状态
 * @param {Object} param
 */
export const batchAdvertiserStatus = (data) => {
    return axios.request({
        method: 'post',
        url: `/api/v1/advertiser/mod/batch`,
        data
    })
}

/**
 * 修改广告主资质
 * @param {Object} param
 */
export const modAdvertiserQual = (data) => {
    return axios.request({
        method: 'post',
        url: `/api/v1/advertiser/qualification/mod`,
        data
    })
}

/**
 * 删除广告主资质
 * @param {Object} param
 */
export const delAdvertiserQual = (data) => {
    return axios.request({
        method: 'post',
        url: `/api/v1/advertiser/qualification/del`,
        data
    })
}
