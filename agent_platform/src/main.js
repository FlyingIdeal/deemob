// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'view-design'
import config from '@/config'

import '@/assets/stylus/theme.less'
import '@/assets/stylus/resetView.styl'
import '@/assets/stylus/iconfont.styl'

// require('@/mock/index')

Vue.config.productionTip = false

/**
 * [$config 挂载config配置]
 * @type {[type]}
 */
Vue.prototype.$config = config

// new bus 中央事件总监
Vue.prototype.$Bus = new Vue()

// api 接口地址  和当前环境对应
import {APIUrl, xlsAPIUrl} from '@/libs/env.api'
Vue.prototype.$APIUrl = APIUrl
Vue.prototype.$xlsAPIUrl = xlsAPIUrl

Vue.use(iView)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {
        App
    },
    store,
    template: '<App/>'
})
