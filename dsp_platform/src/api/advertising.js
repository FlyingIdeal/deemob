import axios from '@/libs/api.request'
import qs from 'qs'

// 投放管理

/**
 * 投放管理 广告活动 获取广告活动的列表
 * @param {Object} param - 参数
 */
export const getAdCampaignList = (data) => {
	return axios.request({
		url: `/api/v1/ad/campaign?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
		method: 'get'
	})
}

/**
 * 投放管理 广告活动 新建广告活动
 * @param {Object} param - 参数
 */
export const saveCampaign = (data) => {
	return axios.request({
		method: 'post',
		url: '/api/v1/ad/campaign',
		data
	})
}
/**
 * 投放管理 广告活动 编辑广告活动
 * @param {Object} param - 参数
 */
export const editCampaign = (data) => {
	return axios.request({
		method: 'put',
		url: '/api/v1/ad/campaign',
		data
	})
}
/**
 * 投放管理 广告活动 批量修改广告活动
 * @param {Object} param - 参数
 */
export const batchCampaign = (data) => {
	return axios.request({
		method: 'put',
		url: '/api/v1/ad/campaign/batch',
		data
	})
}
/**
 * 投放管理 广告单元 获取广告单元的列表
 * @param {Object} param - 参数
 */
export const getAdUnitList = (data) => {
	return axios.request({
		url: `/api/v1/ad/order?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
		method: 'get'
	})
}
/**
 * 投放管理 广告单元 新建广告单元
 * @param {Object} param - 参数
 */
export const saveUnitApi = (data) => {
	return axios.request({
		method: 'post',
		url: '/api/v1/ad/order',
		data
	})
}
/**
 * 投放管理 广告单元 编辑广告单元
 * @param {Object} param - 参数
 */
export const editUnitApi = (data) => {
	return axios.request({
		method: 'put',
		url: '/api/v1/ad/order',
		data
	})
}

/**
 * 投放管理 广告单元 批量修改广告单元
 * @param {Object} param - 参数
 */
export const batchorderApi = (data) => {
	return axios.request({
		method: 'put',
		url: '/api/v1/ad/order/batch',
		data
	})
}
/**
 * 投放管理 广告 获取广告的列表
 * @param {Object} param - 参数
 */
export const getAdCreativeList = (data) => {
	return axios.request({
		url: `/api/v1/ad/ad?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
		method: 'get'
	})
}

/**
 * 投放管理 广告 新建广告
 * @param {Object} param - 参数
 */
export const saveCreativeApi = (data) => {
	return axios.request({
		method: 'post',
		url: '/api/v1/ad/ad',
		data
	})
}
/**
 * 投放管理 广告 编辑广告
 * @param {Object} param - 参数
 */
export const editCreativeApi = (data) => {
	return axios.request({
		method: 'put',
		url: '/api/v1/ad/ad',
		data
	})
}

/**
 * 投放管理 广告 批量修改广告
 * @param {Object} param - 参数
 */
export const batchCreativeApi = (data) => {
	return axios.request({
		method: 'put',
		url: '/api/v1/ad/ad/batch',
		data
	})
}

/**
 * 批量新建广告
 * @param {Object} param - 参数
 */
export const batchAdCreative = (data) => {
	return axios.request({
		method: 'post',
		url: '/api/v1/ad/ad/batch',
		data
	})
}

/**
 * 获取广告名称尾部
 * @param {Object} param - 参数
 */
export const getBatchCreativeTail = (data) => {
	return axios.request({
		url: `/api/v1/ad/ad/batch_tail?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
		method: 'get'
	})
}


/**
 * 获取广告单元关联广告位的素材比例
 * @param {Object} param - 参数
 */
export const getOrderRelatedRatios = (data) => {
	return axios.request({
		url: `/api/v1/ad/order/related_ratios?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
		method: 'get'
	})
}
