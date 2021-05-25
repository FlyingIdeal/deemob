// 工具接口
// 1. 创意包和监测站点
import axios from '@/libs/api.request'
import qs from 'qs'

/**
 * getFinanceList
 * @param {Object} param - 财务明细列表
 */
export const getFinanceList = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/finance/list?${qs.stringify(data)}`,
	})
}

/**
 * [getFinanceListUrl 导出财务明细列表 报表]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export const getFinanceListUrl = (data) => {
	return `/api/v1/finance/list?${qs.stringify(data)}`
}