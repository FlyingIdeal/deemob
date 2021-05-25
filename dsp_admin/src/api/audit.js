import axios from '@/libs/api.request'
import qs from 'qs'

// 审核中心

/**
 * 审核中心 账户审核 获取账户审核列表
 * @param {Object} param - 参数
 */
export const getAccountList = (data) => {
  return axios.request({
    url: `/api/v1/accounts?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
    method: 'get'
  })
}
/**
 * 审核中心 账户审核 获取账户审核列表
 * @param {Object} param - 参数
 */
export const getQualificationApi = (data) => {
  return axios.request({
    url: `/api/v1/account?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
    method: 'get'
  })
}

/**
 * 审核中心 账户审核 审核广告主
 * @param {Object} param - 参数
 */
export const saveAdvertiserVerify = (data) => {
  return axios.request({
    method: 'post',
    url: '/api/v1/advertiser/verify',
    data
  })
}
/**
 * 审核中心 账户审核 审核待审核
 * @param {Object} param - 参数
 */
export const saveAgentVerify = (data) => {
  return axios.request({
    method: 'post',
    url: '/api/v1/agent/verify',
    data
  })
}
/**
 * 审核中心 创意审核 获取广告创意列表
 * @param {Object} param - 参数
 */
export const getCreativeList = (data) => {
  return axios.request({
    url: `/api/v1/creative/list?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
    method: 'get'
  })
}

/**
 * 审核中心 创意审核 修改创意审核
 * @param {Object} param - 参数
 */
export const saveCreativeVerify = (data) => {
  return axios.request({
    method: 'post',
    url: '/api/v1/creative/verify',
    data
  })
}
/**
 * 审核中心 创意审核 获取广告主列表
 * @param {Object} param - 参数
 */
export const getAdvertiserList = (data) => {
  return axios.request({
    url: `/api/v1/advertiser/list?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
    method: 'get'
  })
}

/**
 * 审核中心 创意审核 审核
 * @param {Object} param - 参数
 */
export const getCreativeInfo = (data) => {
  return axios.request({
    url: `/api/v1/creative/info?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
    method: 'get'
  })
}
/**
 * 审核中心 创意审核 批量审核
 * @param {Object} param - 参数
 */
export const batchCreativeStatus = (data) => {
  return axios.request({
    url: `/api/v1/creative/verify/batch`,
    method: 'post',
    data
  })
}




/**
 * 审核中心 审核日志 账号审核
 * @param {Object} param - 参数
 */
export const getAccountRecords = (data) => {
  return axios.request({
    url: `/api/v1/account/verify/records?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
    method: 'get'
  })
}
/**
 * 审核中心 审核日志 创意审核
 * @param {Object} param - 参数
 */
export const getCreativeRecords = (data) => {
  return axios.request({
    url: `/api/v1/creative/verify/records?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
    method: 'get'
  })
}
