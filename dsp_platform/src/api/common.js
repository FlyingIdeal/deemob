import axios from '@/libs/api.request'
import config from '@/config'
import qs from 'qs'
import {
	APIUrl,
	xlsAPIUrl
} from '@/libs/env.api'


/**
 * 获取账户统计信息
 * @param {Object} param - 参数
 */
export const getHomeBaseApi = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/home/base`
	})
}

/**
 * 获取操作系统版本列表
 * @param {Object} param - 参数
 */
export const getOSinfo = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/os_info?${qs.stringify(data, {arrayFormat: 'repeat'})}`
	})
}

/**
 * 获取获取手机品牌及型号
 * @param {Object} param - 参数
 */
export const getMobileBrand = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/mobile_brand?${qs.stringify(data, {arrayFormat: 'repeat'})}`
	})
}

/**
 * 获取应用列表
 * @param {Object} param - 参数
 */
export const getAppList = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/app?${qs.stringify(data, {arrayFormat: 'repeat'})}`
	})
}

/**
 * 获取应用列表
 * @param {Object} param - 参数
 */
export const getDspSlotList = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/dsp_slot?${qs.stringify(data, {arrayFormat: 'repeat'})}`
	})
}

/**
 * 获取配置页面的城市
 * @param {Object} param - 参数
 */
// export const getProvinceCityApi = () => {
//     return axios.request({
//         url: `${APIUrl.mediaComUrl}/api/v1/base/get_province_city`,
//         method: 'get'
//     })
// }

export const getProvinceCityApi = (data) => {
	return axios.request({
		url: `/api/v1/province?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
		method: 'get'
	})
}

/**
 * 获取配置页面的城市
 * @param {Object} param - 参数
 */
export const getPhoneBrand = () => {
	return axios.request({
		url: `${APIUrl.mediaComUrl}/api/v1/base/get_brand`,
		method: 'get'
	})
}
/**
 * 从管理平台获取人群标签
 * @param {Object} param - 参数
 */
export const getCrowdTagListApi = () => {
  return axios.request({
    url: `${APIUrl.adminComUrl}/api/v1/direct_tag/list`,
    method: 'get'
  })
}
/**
 * 获取省份数据
 * @param {Object} param - 参数
 */
export const getProvinceApi = (data) => {
	return axios.request({
		url: `/api/v1/province?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
		method: 'get'
	})
}

/**
 * 根据省份ID获取城市数据
 * @param {Object} param - 参数
 */
export const getCityApi = (data) => {
	return axios.request({
		url: `/api/v1/city?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
		method: 'get'
	})
}

/**
 * 获取银行类型数据
 * @param {Object} param - 参数
 */
export const getBankTypeApi = () => {
	return axios.request({
		url: `${APIUrl.mediaComUrl}/api/v1/base/get_bank_type`,
		method: 'get'
	})
}

/**
 * 根据银行类型ID和城市ID获取银行数据
 * @param {Object} param - 参数
 */
export const getBankNameApi = () => {
	return axios.request({
		url: `${APIUrl.mediaComUrl}/api/v1/base/get_bank`,
		method: 'get'
	})
}

/**
 * 导出
 * @param {Object} param - 参数
 */
export const getDownLoadXls = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/base/download_xls?${qs.stringify(data, {arrayFormat: 'repeat'})}`
	})
}

/**
 * 用户中心的导出
 * @param {Object} param - 参数
 */
export const getUcDownLoadXlsApi = (data) => {
  return axios.request({
    method: 'post',
    url: '/uc_api/v1/base/download_xls',
    data
  })
}

/**
 * 文件上传
 * @param {Object} param - 参数
 */
export const uploadFile = (data) => {
	return axios.request({
		method: 'POST',
		url: `${APIUrl.mediaComUrl}/api/v1/base/upload`,
		data
	})
}

/**
 * [uploadFileUrl 文件上传 导出url]
 * @type {String}
 */
export const uploadFileUrl = `${APIUrl.mediaComUrl}/api/v1/base/upload`

/**
 * 获取获取应用类型
 * @param {Object} param - 参数
 */
export const getAppIndustry = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/base/get_industry?${qs.stringify(data)}`
	})
}

/**
 * 获取首页收入数据
 * @param {Object} param - 参数
 */
export const getHomeBaseIncome = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/home/get_base_income`
	})
}

/**
 * 获取首页曲线图数据
 * @param {Object} param - 参数
 */
export const getHomeLineData = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/home/get_line_data?${qs.stringify(data)}`
	})
}
/**
 * 获取首页面媒体的统计数据
 * @param {Object} param - 参数
 */
export const getHomeSspData = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/home/get_ssp_stat?${qs.stringify(data, {arrayFormat: 'repeat'})}`
	})
}
/**
 * 获取首页面预算方的统计数据
 * @param {Object} param - 参数
 */
export const getHomeDspData = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/home/get_dsp_stat?${qs.stringify(data, {arrayFormat: 'repeat'})}`
	})
}

/**
 * 获取创意形式可选比例
 * @param {Object} param - 参数
 */
export const getCreativeTypeRatio = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/creative/type/ratio?${qs.stringify(data, {arrayFormat: 'repeat'})}`
	})
}


/**
 * dsp平台对于素材上传另外上传接口，文件上传
 * @param {Object} param - 参数
 * 类型，1=PDF，2=图片，3=视频，4=excel，5=ZIP，6=RAR
 */
export const ucUploadFile = (data) => {
	return axios.request({
		method: 'POST',
		url: '/uc_api/v1/file/upload',
		data
	})
}

/**
 * [uploadFileUrl 文件上传 导出url]
 * @type {String}
 */
export const ucUploadFileUrl = `${APIUrl.userBaseUrl}/uc_api/v1/file/upload`
