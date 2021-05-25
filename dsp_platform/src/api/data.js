// 数据管理全部接口
import axios from '@/libs/api.request'
import config from '@/config'
import qs from 'qs'
import {
  APIUrl,
  xlsAPIUrl
} from '@/libs/env.api'

/**
 * 数据报表 创意包数据
 * @param {Object} param - 参数
 */
export const getDataCreativeList = (data) => {
    return axios.request({
        url: `/api/v1/data_creative/list?${qs.stringify(data)}`,
        method: 'get'
    })
}
/**
 * [getFinanceListUrl 导出创意包数据 报表]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export const getAdCreativeListUrl = (data) => {
  return `/api/v1/data_creative/list?${qs.stringify(data)}`
}
/**
 * 数据报表 广告位数据
 * @param {Object} param - 参数
 */
export const getDataSlotList = (data) => {
    return axios.request({
        url: `/api/v1/data_slot/list?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
        method: 'get'
    })
}
/**
 * [getFinanceListUrl 导出广告位数据 报表]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export const getDataSlotUrl = (data) => {
    return `/api/v1/data_slot/list?${qs.stringify(data, {arrayFormat: 'repeat'})}`
}

/**
 * 数据报表 效果数据 天
 * @param {Object} param - 参数
 */
export const getDataEffectData = (data) => {
    return axios.request({
        url: `/api/v1/data_effect/list?${qs.stringify(data, {arrayFormat: 'repeat'}).replace(/%3A/g, ':')}`,
        method: 'get'
    })
}

/**
 * 数据报表 效果数据 下载报表 天
 * @param {Object} param - 参数
 */
export const getDataEffectDataUrl = (data) => {
   return `/api/v1/data_effect/list?${qs.stringify(data, {arrayFormat: 'repeat'}).replace(/%3A/g, ':')}`
}

/**
 * 数据报表 效果数据 小时
 * @param {Object} param - 参数
 */
export const getDataEffectHour = (data) => {
    return axios.request({
        url: `/api/v1/data_effect/list_hour?${qs.stringify(data, {arrayFormat: 'repeat'}).replace(/%3A/g, ':')}`,
        method: 'get'
    })
}

/**
 * 数据报表 效果数据 下载报表 小时
 * @param {Object} param - 参数
 */
export const getDataEffectHourUrl = (data) => {
   return `/api/v1/data_effect/list_hour?${qs.stringify(data, {arrayFormat: 'repeat'}).replace(/%3A/g, ':')}`
}


/**
 * 数据管理 预算数据 获取预算方小时数据报表
 * @param {Object} param - 参数
 */
export const getDspHourData = (data) => {
    return axios.request({
        url: `/api/v1/data_ssp/get_dsp_data_hour?${qs.stringify(data, {arrayFormat: 'repeat'}).replace(/%3A/g, ':')}`,
        method: 'get'
    })
}

/**
 * 数据管理 预算数据 获取预算方小时数据报表 下载报表
 * @param {Object} param - 参数
 */
export const getDspHourDataUrl = (data) => {
   return `/api/v1/data_ssp/get_dsp_data_hour?${qs.stringify(data, {arrayFormat: 'repeat'}).replace(/%3A/g, ':')}`
}

/**
 * 数据管理 素材分析的top值
 * @param {Object} param - 参数
 */
export const getTopMaterialList = (data) => {
  return axios.request({
    url: `/api/v1/material/data/top_list?${qs.stringify(data, {arrayFormat: 'repeat'}).replace(/%3A/g, ':')}`,
    method: 'get'
  })
}

/**
 * 数据管理 素材分析的报表
 * @param {Object} param - 参数
 */
export const getMaterialList = (data) => {
  return axios.request({
    url: `/api/v1/material/data/list?${qs.stringify(data, {arrayFormat: 'repeat'}).replace(/%3A/g, ':')}`,
    method: 'get'
  })
}

/**
 * 数据管理 素材分析的报表  下载报表
 * @param {Object} param - 参数
 */
export const getMaterialListUrl = (data) => {
  return `${APIUrl.baseUrl}/api/v1/material/data/list?${qs.stringify(data, {arrayFormat: 'repeat'}).replace(/%3A/g, ':')}`
}



