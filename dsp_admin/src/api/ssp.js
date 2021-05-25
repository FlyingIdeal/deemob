import axios from '@/libs/api.request'
import qs from 'qs'
import { APIUrl, xlsAPIUrl } from '@/libs/env.api'

// 流量资源中心

/**
 * 获取媒体列表
 * @param {Object} param - 参数
 */
export const getSspList = (data) => {
	return axios.request({
		url: `/api/v1/ssp/ssp/list?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
		method: 'get'
	})
}

/**
 * 批量修改媒体状态
 * @param {Object} param - 参数
 */
export const batchSspStatus = (data) => {
	return axios.request({
		method: 'put',
		url: '/api/v1/ssp/ssp/batch',
		data
	})
}

/**
 * 修改媒体
 * @param {Object} param - 参数
 */
export const modifySsp = (data) => {
	return axios.request({
		method: 'put',
		url: '/api/v1/ssp/ssp/mod',
		data
	})
}

/**
 * 创建媒体
 * @param {Object} param - 参数
 */
export const addNewSsp = (data) => {
	return axios.request({
		method: 'post',
		url: '/api/v1/ssp/ssp/new',
		data
	})
}


/**
 * 获取应用列表
 * @param {Object} param - 参数
 */
export const getSspAppList = (data) => {
	return axios.request({
		url: `/api/v1/ssp/app/list?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
		method: 'get'
	})
}

/**
 * 创建应用
 * @param {Object} param - 参数
 */
export const addNewSspApp = (data) => {
	return axios.request({
		method: 'post',
		url: '/api/v1/ssp/app/new',
		data
	})
}

/**
 * 修改应用
 * @param {Object} param - 参数
 */
export const modifySspApp = (data) => {
	return axios.request({
		method: 'put',
		url: '/api/v1/ssp/app/mod',
		data
	})
}

/**
 * 批量修改应用
 * @param {Object} param - 参数
 */
export const batchSspAppStatus = (data) => {
	return axios.request({
		method: 'put',
		url: '/api/v1/ssp/app/batch',
		data
	})
}

/**
 * 批量新建应用
 * @param {Object} param - 参数
 */
export const importSspApp = (data) => {
	return axios.request({
		method: 'post',
		url: '/api/v1/ssp/app/import',
		data
	})
}

/**
 * [importSspAppUrl 暴露出批量新建应用de  url]
 * @type {String}
 */
export const importSspAppUrl = '/api/v1/ssp/app/import'

/**
 * 获取广告位列表
 * @param {Object} param - 参数
 */
export const getSspSlotList = (data) => {
	return axios.request({
		url: `/api/v1/ssp/slot/list?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
		method: 'get'
	})
}

/**
 * [getSspSlotListUrl 获取广告位列表-下载使用]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export const getSspSlotListUrl = (data) => {
	return `${APIUrl.operateComUrl}/api/v1/ssp/slot/list?${qs.stringify(data, {arrayFormat: 'repeat'})}`
}

/**
 * 创建广告位
 * @param {Object} param - 参数
 */
export const addNewSspSlot = (data) => {
	return axios.request({
		method: 'post',
		url: '/api/v1/ssp/slot/new',
		data
	})
}

/**
 * 修改广告位
 * @param {Object} param - 参数
 */
export const modifySspSlot = (data) => {
	return axios.request({
		method: 'put',
		url: '/api/v1/ssp/slot/mod',
		data
	})
}

/**
 * 批量修改广告位
 * @param {Object} param - 参数
 */
export const batchSspSlotStatus = (data) => {
	return axios.request({
		method: 'put',
		url: '/api/v1/ssp/slot/batch',
		data
	})
}

/**
 * 批量新建广告位
 * @param {Object} param - 参数
 */
export const importSspSlot = (data) => {
	return axios.request({
		method: 'post',
		url: '/api/v1/ssp/slot/import',
		data
	})
}

/**
 * [importSspAppUrl 暴露出批量新建广告位de  url]
 * @type {String}
 */
export const importSspSlotUrl = '/api/v1/ssp/slot/import'