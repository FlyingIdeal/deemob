import axios from '@/libs/api.request'

// 账户中心
/**
 * 获取代理商列表
 * getAgentList
 * @param {Object} param - 参数
 */
export const getAgentInfo = (data) => {
	return axios.request({
		url: `/api/v1/agent/info`,
		method: 'get'
	})
}

/**
 * 修改代理商
 * @param {Object} param - 参数
 */
export const modifyAgent = (data) => {
	return axios.request({
		method: 'post',
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
		method: 'post',
		url: `/api/v1/agent/password/reset`,
		data
	})
}
/**
 * 获取验证码
 * @param {Object} param - 修改代理商密码
 */
export const getMobileCode = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/agent/vercode`
	})
}
