import axios from '@/libs/api.request'
import qs from 'qs'

/**
 * 账号权限-新建模块
 * @param {Object} param - 参数
 */
export const receiverNotifications = (data) => {
  return axios.request({
    method: 'put',
    url: '/api/v1/notification/receiver',
    data
  })
}

/**
 * 通知中心 获取系统通知的接口
 * @param {Object} param - 参数
 */
export const getNotifications = (data) => {
  return axios.request({
    url: `/api/v1/notifications?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
    method: 'get'
  })
}

