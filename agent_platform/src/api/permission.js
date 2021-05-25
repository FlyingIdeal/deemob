import axios from '@/libs/api.request'
import qs from 'qs'

/**
 * 账号权限-新建模块
 * @param {Object} param - 参数
 */
export const addSysModule = (data) => {
	return axios.request({
		method: 'post',
		url: '/uc_api/v1/model/save',
		data
	})
}

/**
 * 账号权限 获取模块列表
 * @param {Object} param - 参数
 */
export const getSysModule = (data) => {
	return axios.request({
		url: `/uc_api/v1/model/list?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
		method: 'get'
	})
}

/**
 * 账号权限 获取模块列表
 * @param {Object} param - 参数
 */
export const delelteSysModule = (data) => {
	return axios.request({
		url: '/uc_api/v1/sys_model/del',
		method: 'delete',
		data
	})
}
/**
 * 账号权限 获取角色列表
 * @param {Object} param - 参数
 */
export const getSysRole = (data) => {
	return axios.request({
		url: `/uc_api/v1/role/list?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
		method: 'get'
	})
}
/**
 * 账号权限 新建与编辑角色列表
 * @param {Object} param - 参数
 */
export const addSysRole = (data) => {
	return axios.request({
		method: 'post',
		url: '/uc_api/v1/role/save',
		data
	})
}
/**
 * 账号权限 更新角色列表
 * @param {Object} param - 参数
 */
export const updateSysRole = (data) => {
	return axios.request({
		method: 'PATCH',
		url: '/api/v1/sys_role/mod',
		data
	})
}
/**
 * 账号权限 删除角色
 * @param {Object} param - 参数
 */
export const deleteSysRole = (data) => {
	return axios.request({
		method: 'DELETE',
		url: '/uc_api/v1/role/del',
		data
	})
}
/**
 * 账号权限 获取角色详情
 * @param {Object} param - 参数
 */
export const detailSysRole = (data) => {
	return axios.request({
		url: `/uc_api/v1/role/info?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
		method: 'get'
	})
}
/**
 * 账号权限 获取账号的列表
 * @param {Object} param - 参数
 */
export const getSysUserList = (data) => {
	return axios.request({
		url: `/uc_api/v1/users?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
		method: 'get'
	})
}
/**
 * 账号权限 创建账号
 * @param {Object} param - 参数
 */
export const addSysUser = (data) => {
	return axios.request({
		method: 'POST',
		url: '/uc_api/v1/user/save',
		data
	})
}
/**
 * 账号权限 修改账号
 * @param {Object} param - 参数
 */
export const updateSysUser = (data) => {
	return axios.request({
		method: 'PATCH',
		url: '/api/v1/user_sys/mod',
		data
	})
}
/**
 * 账号权限 修改账号密码
 * @param {Object} param - 参数
 */
export const updateSysUserPassWord = (data) => {
	return axios.request({
		method: 'PATCH',
		url: '/uc_api/v1/user/reset_pwd',
		data
	})
}
/**
 * 账号权限 分配资源
 * @param {Object} param - 参数
 */
export const getResourceAlloc = (data) => {
	return axios.request({
		method: 'post',
		url: '/api/v1/user_sys/resource/alloc',
		data
	})
}
/**
 * 账号权限 分配资源获取
 * @param {Object} param - 参数
 */
export const getResourceData = (data) => {
	return axios.request({
		url: `/api/v1/user_sys/resource/get?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
		method: 'get'
	})
}
