import {
	getLogin,
	shamLogin,
	logOut,
	getCaptchaCode,
	verifySession,
    getSysUserInfo,
	getSysUserRole
} from '@/api/user'

import {
	getProvinceCityApi,
	getPhoneBrand,
	getAppStoreList,
	getCategoryList,
	getRtaList,
	getDspSlotList
} from '@/api/common'

import {
	getMenuByRouter,
	getKeyByRouter,
	adminGetMenuByRouter
} from '@/libs/util'

import {
	constantRouterMap,
	asyncRouterMap,
	noFoundRouterMap
} from '@/router/routers'

import config from '@/config'

export default {
	state: {
		userName: sessionStorage.getItem('userName') || '', // 用户姓名
		userId: sessionStorage.getItem('userId') || '', // 用户id
		userInfo: '', // 系统登录的用户基本信息

		userRoute: [], // 用户路由
		catchMenuByRouter: [], // 缓存路由
		userRouteKeyObj: {}, // 用户路由key值
		userDspFields: [], // 用户dsp自定义权限
		userSspFields: [], // 用户ssp自定义权限
		userAllFields: false, // 用户报表权限的全选
		userAllModels: false, // 用户菜单的全选

		provinceCityArr: [], // 城市的选择
		phoneBrandArr: [], // 手机品牌
		categoryArr: [], // 行业类型 - 行业类型是代理商和广告主的类型，影响广告主创建后的初始化资质
		rtaList: [] // rta列表
	},
	getters: {
		menuList: (state, getters, rootState) => getMenuByRouter([...constantRouterMap, ...asyncRouterMap, ...noFoundRouterMap], rootState.user.access),
		// menuList: state => state.catchMenuByRouter, // 用户路由
		userInPageRole: state => state.userRouteKeyObj, // 用户页面内权限
		getUserRoute: state => state.userRoute, // 用户路由
		getUserDspFields: state => state.userDspFields, // 用户dsp自定义权限 - 预算表格
		getUserSspFields: state => state.userSspFields, // 用户ssp自定义权限 - 流量表格
		getUserAllFields: state => state.userAllFields, // 用户报表的全选
		getUserAllModels: state => state.userAllModels // 用户菜单的全选
	},
	mutations: {
		/**
		 * @param {[type]}
		 * @param {[type]}
		 */
		setUserId(state, id) {
			sessionStorage.setItem('userId', id)
			state.userId = id
		},
		setUserName(state, name) {
			sessionStorage.setItem('userName', name)
			state.userName = name

			localStorage.setItem('userName', name) // uc_api调整后，需要在本地存储个人登录名称
		},
		setUserInfo(state, info) { // 用户基本信息
			state.userInfo = info
		},
		setUserRole(state, info) { // 用户权限
			let role = info.role
			state.userRoute = !!role && !!role.models && role.models.length ? role.models : [] // 用户路由
			state.userDspFields = !!role && !!role.dsp_fields && role.dsp_fields.length ? role.dsp_fields : [] // 用户dsp自定义权限 - 预算表格
			state.userSspFields = !!role && !!role.ssp_fields && role.ssp_fields.length ? role.ssp_fields : [] // 用户ssp自定义权限 - 流量表格

			state.userAllFields = state.userName === config.superName ? true : (!!role && !!role.all_fields) // 用户报表的全选
			state.userAllModels = state.userName === config.superName ? true : (!!role && !!role.all_models) // 用户菜单的全选

			state.userRouteKeyObj = getKeyByRouter(state.userRoute)
			state.catchMenuByRouter = state.userName === config.superName ? adminGetMenuByRouter(asyncRouterMap) : getMenuByRouter(asyncRouterMap, state.userRouteKeyObj) // 左侧导航路由

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

			state.userDspFields = [] // 用户dsp自定义权限
			state.userSspFields = [] // 用户ssp自定义权限

			state.userAllFields = false // 用户ssp自定义权限
			state.userAllModels = false // 用户ssp自定义权限
		},

		/**
		 * [setLoginOut 退出登录]
		 * @param {[type]} state [description]
		 * @param {[type]} name  [description]
		 */
		setLoginOut(state, name) {
			sessionStorage.removeItem('userName')
			sessionStorage.removeItem('userId')
			localStorage.removeItem('userName')
			state.userId = ''
			state.userName = ''
			state.userInfo = ''
		},
		setAllProvinceCity(state, arr) { // 设置城市
			state.provinceCityArr = arr
		},
		setAllPhoneBrand(state, arr) { // 手机品牌
			state.phoneBrandArr = arr
		},
		setCategoryList(state, arr) { // 设置行业类型列表
			// 行业类型是代理商和广告主的类型，影响广告主创建后的初始化资质
			state.categoryArr = arr
		},
		setRtaList(state, arr) { // rta列表
			state.rtaList = arr
		}
	},
	actions: {
		/**
		 * [getMediaCompany 获取省市的列表]
		 * @param  {[type]} options.state  [description]
		 * @param  {[type]} options.commit [description]
		 * @return {[type]}                [description]
		 */
		getPhoneBrand({state, commit}) {
			return new Promise((resolve, reject) => {
				try {
					getPhoneBrand().then(res => {
						commit('setAllPhoneBrand', res.data.list)
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
						commit('setAllProvinceCity', res.data.list)
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
		 * [getAppStoreList 应用类型+类别]
		 * @param  {[type]} options.state  [description]
		 * @param  {[type]} options.commit [description]
		 * @return {[type]}                [description]
		 */
		getCategoryList({state, commit}, payload) {
			return new Promise((resolve, reject) => {
				try {
					getCategoryList(payload).then(res => {

						let result = (res.code === 200 && res.data && res.data.list) ? res.data.list : []
						commit('setCategoryList', result)
						resolve(result)
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
							commit('setUserName', res.data.user_info.account)
							commit('setUserId', res.data.user_info.id)
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
         * [shamLogin 伪登录]
         * @param  {[type]} options.state  [description]
         * @param  {[type]} options.commit [description]
         * @param  {[type]} params         [description]
         * @return {[type]}                [description]
         */
        shamLogin({state, commit}, params) {
            return new Promise((resolve, reject) => {
                try {
                    shamLogin(params).then(res => {
                        if (res.code === 200) {
                            commit('setUserName', res.data.user_info.account)
							commit('setUserId', res.data.user_info.id)
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
        getSysUserInfo({ state, commit }) {
            return new Promise((resolve, reject) => {
                try {
                    getSysUserInfo().then(res => {
						let result = (res.code === 200 && res.data && res.data.agent) ? res.data.agent : ''
						commit('setUserInfo', result)
						resolve(result)
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

						if (res.code === 200) {
							commit('setUserName', localStorage.getItem('userName') || '')
							commit('setUserId', res.data.uc_id)
						}
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
		 * @param  {获取系统用户信息}
		 * @param  {[type]}
		 * @return {[type]}
		 */
		getSysUserRole({state, commit}) {
			return new Promise((resolve, reject) => {
				try {
					getSysUserRole().then(res => {
						if (res.code === 200) {
							commit('setUserRole', res.data)
						}
						resolve(res)
					}).catch(err => {

						commit('setUserRole', err)

						reject(err)
					})
				} catch (error) {
					reject(error)
				}
			})
		},
		/**
		 * [getDspSlotList 缓存所有的预算位公司列表，在预算位管理搜索中使用]
		 * @param  {[type]} options.state  [description]
		 * @param  {[type]} options.commit [description]
		 * @param  {[type]} payload        [description]
		 * @return {[type]}                [description]
		 */
		getDspSlotList({state, commit}, params) {
			return new Promise((resolve, reject) => {
				try {
					getDspSlotList(params).then(res => {
						resolve(res.code === 200 ? res.data.list : [])
					}).catch(err => {
						reject(err)
					})
				} catch (error) {
					reject(error)
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
