import {
	getLogin,
	logOut,
	getCaptchaCode,
	verifySession
} from '@/api/user'

import {
	getProvinceCityApi,
	getPhoneBrand,
	getAppStoreList,
	getCategoryList,
	getRtaList
} from '@/api/common'

import {
	getHomeRoute,
	getMenuByRouter,
	getKeyByRouter
} from '@/libs/util'

import {
	constantRouterMap,
	asyncRouterMap,
	noFoundRouterMap
} from '@/router/routers'


import config from '@/config'

export default {
	state: {
		userName: localStorage.getItem('userName') || '', // 用户姓名
		userId: localStorage.getItem('userId') || '', // 用户id
		userInfo: {}, // 系统用户基本信息
		userModelList: [], // 用户模块列表

		userRoute: [], // 用户路由
		catchMenuByRouter: [], // 缓存路由
		userRouteKeyObj: {}, // 用户路由key值

		provinceCityArr: [], // 城市的选择
		phoneBrandArr: [], // 手机品牌
		rtaList: [] // rta列表
	},
	getters: {
		menuList: state => state.catchMenuByRouter, // 用户路由
		userInPageRole: state => state.userRouteKeyObj, // 用户页面内权限
		getUserRoute: state => state.userRoute, // 用户路由
	},
	mutations: {
		/**
		 * [storeUserInfo 存储用户相关信息]
		 * @param  {[type]} state [description]
		 * @param  {[type]} info  [description]
		 * @return {[type]}       [description]
		 */
		storeUserInfo(state, data) {
			const user_info = data.user_info || {} // 用户基本信息
			const model_list = data.model_list || [] // 模块列表

			// userid
			state.userId = user_info.id
			localStorage.setItem('userId', user_info.id)

			// userName
			state.userName = user_info.account
			localStorage.setItem('userName', user_info.account)

			// user_info
			state.userInfo = user_info
			localStorage.setItem('USERINFO', JSON.stringify(user_info))

			// model_list
			state.userModelList = model_list
			localStorage.setItem('USERMODELLIST', JSON.stringify(model_list))

			// 设置用户的路由+页面内权限
			this.commit('setUserRole', model_list)
		},
		/**
		 * [setLoginOut 退出登录 - 情况信息]
		 * @param {[type]} state [description]
		 * @param {[type]} name  [description]
		 */
		setLoginOut(state, name) {
			localStorage.removeItem('userName')
			localStorage.removeItem('userId')

			localStorage.removeItem('USERINFO')
			localStorage.removeItem('USERMODELLIST')

			state.userId = ''
			state.userName = ''
			state.userInfo = {}
			state.userModelList = []
		},
		/**
		 * [setUserRole 设置用户路由权限+页面内权限]
		 * @param {[type]} state [description]
		 * @param {[type]} routeList  [路由数据/array]
		 */
		setUserRole(state, routeList) { // 用户权限
			state.userRoute = routeList // 用户路由
			state.userRouteKeyObj = getKeyByRouter(routeList)

			state.catchMenuByRouter = getMenuByRouter(asyncRouterMap, state.userRouteKeyObj)
		},

		/**
		 * [resetUserRole 重置用户角色]
		 * @param  {[type]} state [description]
		 * @return {[type]}       [description]
		 */
		resetUserRole(state) {
			state.userRoute = [] // 用户路由
			state.catchMenuByRouter = []
			state.userRouteKeyObj = {} // 用户路由key值
		},
		/**
		 * [setAllProvinceCity 设置城市]
		 * @param {[type]} state [description]
		 * @param {[type]} arr   [description]
		 */
		setAllProvinceCity(state, arr) {
			state.provinceCityArr = arr
		},
		/**
		 * [setAllPhoneBrand 手机品牌]
		 * @param {[type]} state [description]
		 * @param {[type]} arr   [description]
		 */
		setAllPhoneBrand(state, arr) {
			state.phoneBrandArr = arr
		},
		setRtaList(state, arr) { // rta列表
			state.rtaList = arr
		}
	},
	actions: {
		/**
		 * [getPhoneBrand 获取手机品牌]
		 * @param  {[type]} options.state  [description]
		 * @param  {[type]} options.commit [description]
		 * @return {[type]}                [description]
		 */
		getPhoneBrand({state, commit}) {
			return new Promise((resolve, reject) => {
				try {
					getPhoneBrand().then(res => {
						if(res.code === 200) {
							commit('setAllPhoneBrand', res.data.list)
						}
						resolve(res.data.list)
					}).catch(err => {
						reject(err)
					})
				} catch (error) {
					reject(error)
				}
			})
		},
		/**
		 * [getProvinceCityApi 获取省市的列表]
		 * @param  {[type]} options.state  [description]
		 * @param  {[type]} options.commit [description]
		 * @return {[type]}                [description]
		 */
		getProvinceCityApi({state, commit}) {
			return new Promise((resolve, reject) => {
				try {
					getProvinceCityApi().then(res => {
						if(res.code === 200) {
							commit('setAllProvinceCity', res.data.list)
						}
						resolve(res.data.list)
					}).catch(err => {
						reject(err)
					})
				} catch (error) {
					reject(error)
				}
			})
		},
		/**
		 * [getAppStoreList 获取应用商店数据]
		 * @param  {[type]} options.state  [description]
		 * @param  {[type]} options.commit [description]
		 * @return {[type]}                [description]
		 */
		getAppStoreList({state, commit}, payload) {
			return new Promise((resolve, reject) => {
				try {
					getAppStoreList(payload).then(res => {
						resolve(res)
					}).catch(err => {
						reject(err)
					})
				} catch (error) {
					reject(error)
				}
			})
		},
		/**
		 * [getAppStoreList 行业类型列表+类别]
		 * @param  {[type]} options.state  [description]
		 * @param  {[type]} options.commit [description]
		 * @return {[type]}                [description]
		 */
		getCategoryList({state, commit}, payload) {
			return new Promise((resolve, reject) => {
				try {
					getCategoryList(payload).then(res => {
						resolve(res)
					}).catch(err => {
						reject(err)
					})
				} catch (error) {
					reject(error)
				}
			})
		},

		/**
		 * [logOut 退出登录]
		 * @param  {[type]} options.state  [description]
		 * @param  {[type]} options.commit [description]
		 * @return {[type]}                [description]
		 */
		logOut({state, commit}, params) {
			return new Promise((resolve, reject) => {
				try {
					logOut(params).then(res => {
						resolve(res)
					}).catch(err => {
						reject(err)
					})
				} catch (error) {
					reject(error)
				}
			})
		},
		/**
		 * [getLogin 登录]
		 * @param  {[type]} options.state  [description]
		 * @param  {[type]} options.commit [description]
		 * @param  {[type]} params         [description]
		 * @return {[type]}                [description]
		 */
		getLogin({state, commit}, params) {
			return new Promise((resolve, reject) => {
				try {
					getLogin(params).then(res => {
						if (res.code === 200) {
							commit('storeUserInfo', res.data) // 存储用户相关信息
						}
						resolve(res)
					}).catch(err => {
						reject(err)
					})
				} catch (error) {
					reject(error)
				}
			})
		},
		/**
		 * [getCaptchaCode 获取验证码]
		 * @param  {[type]} options.state  [description]
		 * @param  {[type]} options.commit [description]
		 * @param  {[type]} params         [description]
		 * @return {[type]}                [description]
		 */
		getCaptchaCode({state, commit}) {
			return new Promise((resolve, reject) => {
				try {
					getCaptchaCode().then(res => {
						resolve(res)
					}).catch(err => {
						reject(err)
					})
				} catch (error) {
					reject(error)
				}
			})
		},

		/**
		 * @param  {获取系统用户信息}
		 * @param  {[type]}
		 * @return {[type]}
		 */
		verifySession({state, commit}, params) {
			return new Promise((resolve, reject) => {
				try {
					verifySession(params).then(res => {
						resolve(res.data)
					}).catch(err => {
						reject(err)
					})
				} catch (error) {
					reject(error)
				}
			})
		},
		/**
         * @getSysUserRoute  {获取系统用户左导航路由}
         * @param  {[type]}
         * @return {[type]}
         */
        getSysUserRoute({ state, commit }) {
            return new Promise((resolve, reject) => {
				try {
					const USERMODELLIST = localStorage.getItem('USERMODELLIST')

					let result = !!USERMODELLIST ? JSON.parse(USERMODELLIST) : []

					commit('setUserRole', result)

					resolve(true)
				} catch (error) {
					reject(false)
				}
            })
        },
        /**
		 * [getRtaList 获取RTA合作方列表]
		 * @param  {[type]} options.state  [description]
		 * @param  {[type]} options.commit [description]
		 * @return {[type]}                [description]
		 */
		getRtaList({state, commit}) {
			return new Promise((resolve, reject) => {
				try {
					getRtaList().then(res => {
						let result = (res.code === 200 && res.data && res.data.list) ? res.data.list : []
						commit('setRtaList', result)
						resolve(result)
					}).catch(err => {
						reject(err)
					})
				} catch (error) {
					reject(error)
				}
			})
		}
	}
}