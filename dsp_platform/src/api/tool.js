// 工具接口
// 1. 创意包和监测站点
import axios from '@/libs/api.request'
import qs from 'qs'

export const toolCreativeUrl = '/api/v1/tool/creative' // 创意包 请求公共接口
export const toolSiteUrl = '/api/v1/tool/site' // 监测站点 请求公共接口

/**
 * addCreative
 * @param {Object} param - 新建创意包
 */
export const addCreative = (data) => {
	return axios.request({
		url: toolCreativeUrl,
		method: 'post',
		data
	})
}

/**
 * 批量新建创意包
 * @param {Object} param - 新建创意包
 */
export const batchAddCreative = (data) => {
	return axios.request({
		url: '/api/v1/tool/creative/batch',
		method: 'post',
		data
	})
}

/**
 * editCreative
 * @param {Object} param - 修改创意包
 */
export const editCreative = (data) => {
	return axios.request({
		url: toolCreativeUrl,
		method: 'put',
		data
	})
}

/**
 * editCreative
 * @param {Object} param - 删除创意包
 */
export const deleteCreative = (data) => {
	return axios.request({
		url: toolCreativeUrl,
		method: 'delete',
		data
	})
}

/**
 * getMaterialGroupList
 * @param {Object} param - 获取素材组
 */
export const getMaterialGroupList = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/material/group/list?${qs.stringify(data, {arrayFormat: 'repeat'})}`
	})
}
/**
 * deleteMaterialGroup
 * @param {Object} param - 删除素材组
 */
export const deleteMaterialGroup = (data) => {
	return axios.request({
		url: '/api/v1/material/group',
		method: 'delete',
		data
	})
}
/**
 * addMaterialGroup
 * @param {Object} param - 新建素材组
 */
export const addMaterialGroup = (data) => {
	return axios.request({
		url: '/api/v1/material/group',
		method: 'POST',
		data
	})
}
/**
 * getMaterialTagList
 * @param {Object} param - 获取标签
 */
export const getMaterialTagList = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/material/tag/list?${qs.stringify(data, {arrayFormat: 'repeat'})}`
	})
}
/**
 * deleteMaterialTag
 * @param {Object} param - 删除标签
 */
export const deleteMaterialTag = (data) => {
	return axios.request({
		url: '/api/v1/material/tag',
		method: 'delete',
		data
	})
}
/**
 * addMaterialTag
 * @param {Object} param - 新建标签
 */
export const addMaterialTag = (data) => {
	return axios.request({
		url: '/api/v1/material/tag',
		method: 'POST',
		data
	})
}
/**
 * getCreativeList
 * @param {Object} param - 获取创意包列表
 */
export const getCreativeList = (data) => {
	return axios.request({
		method: 'get',
		url: `${toolCreativeUrl}?${qs.stringify(data, {arrayFormat: 'repeat'})}`
	})
}

/**
 * addToolSite
 * @param {Object} param - 新建监测站点
 */
export const addToolSite = (data) => {
	return axios.request({
		url: toolSiteUrl,
		method: 'post',
		data
	})
}

/**
 * editToolSite
 * @param {Object} param - 修改监测站点
 */
export const editToolSite = (data) => {
	return axios.request({
		url: toolSiteUrl,
		method: 'put',
		data
	})
}

/**
 * getToolSiteList
 * @param {Object} param - 获取监测站点列表
 */
export const getToolSiteList = (data) => {
	return axios.request({
		method: 'get',
		url: `${toolSiteUrl}?${qs.stringify(data)}`
	})
}

/**
 * addMaterial
 * @param {Object} param - 添加素材
 */
export const addMaterial = (data) => {
	return axios.request({
		url: '/api/v1/material',
		method: 'post',
		data
	})
}

/**
 * modMaterial
 * @param {Object} param - 修改素材
 */
export const modMaterial = (data) => {
	return axios.request({
		url: '/api/v1/material',
		method: 'put',
		data
	})
}

/**
 * deleteMaterial
 * @param {Object} param - 删除素材
 */
export const deleteMaterial = (data) => {
	return axios.request({
		url: '/api/v1/material',
		method: 'delete',
		data
	})
}

/**
 * 获取素材列表
 * @param {Object} param
 */
export const getMaterialList = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/material/list?${qs.stringify(data, {arrayFormat: 'repeat'})}`
	})
}

/**
 * 获取素材仪表数据
 * @param {Object} param - 删除素材
 */
export const getMaterialDashboard = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/material/dashboard?${qs.stringify(data, {arrayFormat: 'repeat'})}`
	})
}