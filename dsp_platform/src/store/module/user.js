import {
    getLogin,
    shamLogin,
    logOut,
    getSysUserInfo
} from '@/api/user'

import {
    getAdCampaignList,
    getAdUnitList,
    getAdCreativeList
} from '@/api/advertising'

import {
    getProvinceCityApi,
    getPhoneBrand
} from '@/api/common'

import {
    getHomeRoute,
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
        userName: localStorage.getItem('userName') || '', // 用户姓名
        userId: localStorage.getItem('userId') || '', // 用户id
        userInfo: {}, // 系统用户登录基本信息
        accountUserInfo: '', // 系统账户中心

        userRoute: [], // 用户路由
        catchMenuByRouter: [], // 缓存路由
        userRouteKeyObj: {}, // 用户路由key值

        provinceCityArr: [], // 城市的选择
        phoneBrandArr: [], // 手机品牌


        adCampaignList: [], // 广告活动
        adUnitList: [], // 广告单元
        adCreativeList: [] // 广告
    },
    getters: {
        menuList: (state, getters, rootState) => getMenuByRouter([...constantRouterMap, ...asyncRouterMap, ...noFoundRouterMap], rootState.user.access),
        userInPageRole: state => state.userRouteKeyObj, // 用户页面内权限
        getUserRoute: state => state.userRoute // 用户路由
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

            // userid
            state.userId = user_info.id
            localStorage.setItem('userId', user_info.id)

            // userName
            state.userName = user_info.account
            localStorage.setItem('userName', user_info.account)

            // user_info
            state.userInfo = user_info
            localStorage.setItem('USERINFO', JSON.stringify(user_info))
        },
        /**
         * [setLoginOut 退出登录]
         * @param {[type]} state [description]
         * @param {[type]} name  [description]
         */
        setLoginOut(state, name) {
            localStorage.removeItem('userName')
            localStorage.removeItem('userId')
            localStorage.removeItem('USERINFO')

            state.userId = ''
            state.userName = ''
            state.userInfo = {}
            state.accountUserInfo = ''
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
         * [accountUserInfo 系统账户中心]
         * @param  {[type]} state [description]
         * @param  {[type]} data  [description]
         * @return {[type]}       [description]
         */
        setAccountUserInfo(state, data) {
            state.accountUserInfo = data
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
		setAllProvinceCity(state, arr) { // 设置城市
			state.provinceCityArr = arr
		},
		setAllPhoneBrand(state, arr) { // 手机品牌
			state.phoneBrandArr = arr
		},
        /**
         * [setAdCampaignList 投放管理-广告活动]
         * @param {[type]} state [description]
         * @param {[type]} arr   [description]
         */
        setAdCampaignList(state, arr) {
            state.adCampaignList = arr
        },
        /**
         * [setAdCampaignList 投放管理-广告单元]
         * @param {[type]} state [description]
         * @param {[type]} arr   [description]
         */
        setAdUnitList(state, arr) {
            state.adUnitList = arr
        },
        /**
         * [setAdCampaignList 投放管理-广告]
         * @param {[type]} state [description]
         * @param {[type]} arr   [description]
         */
        setAdCreativeList(state, arr) {
            state.adCreativeList = arr
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
         * @param  {获取系统用户信息}
         * @param  {[type]}
         * @return {[type]}
         */
        getSysUserInfo({ state, commit }) {
            return new Promise((resolve, reject) => {
                try {
                    getSysUserInfo().then(res => {
                        if (res.code === 200) {
                            commit('setAccountUserInfo', res.data)
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
         * [getDspSlotList 缓存所有的预算位公司列表，在预算位管理搜索中使用]
         * @param  {[type]} options.state  [description]
         * @param  {[type]} options.commit [description]
         * @param  {[type]} payload        [description]
         * @return {[type]}                [description]
         */
        getDspSlotList({ state, commit }, params) {
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
         * [getAdCampaignList 投放管理-广告活动]
         * @param  {[type]} options.state  [description]
         * @param  {[type]} options.commit [description]
         * @return {[type]}                [description]
         */
        getAdCampaignList({ state, commit }, params) {
            return new Promise((resolve, reject) => {
                try {

                    let flag = !params || JSON.stringify(params) === "{}"
                    let inparams = {
                        page_num: 1
                    }

                    if(!flag) {
                        inparams = {...inparams, ...params}
                    }

                    getAdCampaignList(inparams).then(res => {
                        // 做筛选时，不需要存储
                        if(flag) {
                            commit('setAdCampaignList', res.code === 200 ? res.data.list : [])
                        }
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
         * [getAdUnitList 投放管理-广告单元]
         * @param  {[type]} options.state  [description]
         * @param  {[type]} options.commit [description]
         * @return {[type]}                [description]
         */
        getAdUnitList({ state, commit }, params) {
            return new Promise((resolve, reject) => {
                try {
                    let flag = !params || JSON.stringify(params) === "{}"
                    let inparams = {
                        page_num: 1
                    }

                    if(!flag) {
                        inparams = {...inparams, ...params}
                    }


                    getAdUnitList(inparams).then(res => {
                        // 做筛选时，不需要存储
                        if(flag) {
                            commit('setAdUnitList', res.code === 200 ? res.data.list : [])
                        }
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
         * [getAdCreativeList 投放管理-广告]
         * @param  {[type]} options.state  [description]
         * @param  {[type]} options.commit [description]
         * @return {[type]}                [description]
         */
        getAdCreativeList({ state, commit }) {
            return new Promise((resolve, reject) => {
                try {
                    getAdCreativeList({page_num: 1}).then(res => {
                        commit('setAdCreativeList', res.code === 200 ? res.data.list : [])
                        resolve(res.code === 200 ? res.data.list : [])
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
