import axios from '@/libs/api.request'
import qs from 'qs'
import { APIUrl, xlsAPIUrl } from '@/libs/env.api'

// 花费数据导入 + 链接录入

/**
 * 获取导入收入列表
 * @param {Object} param - 参数
 */
export const getIncomeList = (data) => {
	return axios.request({
		url: `/api/v1/import/get_income_list?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
		method: 'get'
	})
}

/**
 * 导入收入列表
 * @param {Object} param - 参数
 */
export const addIncomeList = (data) => {
	return axios.request({
		method: 'post',
		url: '/api/v1/import/add_income_list',
		data
	})
}

/**
 * 导入收入列表 - url
 * @param {Object} param - 参数
 */
export const addIncomeListUrl = '/api/v1/import/add_income_list'

/**
 * 获取导入KV列表
 * @param {Object} param - 参数
 */
export const getIncomeKv = (data) => {
	return axios.request({
		url: `/api/v1/import/get_income_kv?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
		method: 'get'
	})
}

/**
 * 获取导入KV列表 - url
 * @param {Object} param - 参数
 */
export const getIncomeKvUrl = (data) => {
	return `${APIUrl.operateComUrl}/api/v1/import/get_income_kv?${qs.stringify(data, {arrayFormat: 'repeat'})}`
}

/**
 * 导入KV列表
 * @param {Object} param - 参数
 */
export const addIncomeKv = (data) => {
	return axios.request({
		method: 'post',
		url: '/api/v1/import/add_income_kv',
		data
	})
}

/**
 * 导入KV列表 - url
 * @param {Object} param - 参数
 */
export const addIncomeKvUrl = '/api/v1/import/add_income_kv'

/**
 * 删除KV列表
 * @param {Object} param - 参数
 */
export const delIncomeKv = (data) => {
	return axios.request({
		method: 'delete',
		url: '/api/v1/import/del_income_kv',
		data
	})
}
