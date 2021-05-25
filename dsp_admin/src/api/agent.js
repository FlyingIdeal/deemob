import axios from '@/libs/api.request'
import qs from 'qs'

// 代理商

/**
 * 获取代理商列表
 * getAgentList
 * @param {Object} param - 参数
 */
export const getAgentList = (data) => {
	return axios.request({
		url: `/api/v1/agent/list?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
		method: 'get'
	})
}

/**
 * 新建代理商
 * @param {Object} param - 参数
 */
export const addNewAgent = (data) => {
	return axios.request({
		method: 'post',
		url: '/api/v1/agent/new',
		data
	})
}

/**
 * 修改代理商
 * @param {Object} param - 参数
 */
export const modifyAgent = (data) => {
	return axios.request({
		method: 'put',
		url: '/api/v1/agent/mod',
		data
	})
}

/**
 * resetAgentPsw
 * @param {Object} param - 修改代理商密码
 */
export const resetAgentPsw = (data) => {
    return axios.request({
        method: 'patch',
        url: `/api/v1/agent/password/reset`,
        data
    })
}
/**
 * modifyAgentPricex
 * @param {Object} param - 修改代理商暗扣系数
 */
export const modifyAgentPricex = (data) => {
    return axios.request({
        method: 'patch',
        url: `/api/v1/agent/pricex/mod`,
        data
    })
}

/**
 * 批量修改代理商状态
 * @param {Object} param - 参数
 */
export const batchAgentStatus = (data) => {
	return axios.request({
		method: 'post',
		url: '/api/v1/agent/status/batch',
		data
	})
}