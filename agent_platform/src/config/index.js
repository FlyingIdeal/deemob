export default {
    /**
     * @description 配置显示在浏览器标签的title
     */
    title: '慧营代理商平台',
    /**
     * @description token在Cookie中存储的天数，默认1天
     */
    cookieExpires: 1,
    /**
     * [superName 超级管理员的名字]
     * @type {String}
     */
    superName: 'admin',

    /**
     * [platform_id 当前平台的id]
     * @type {Number}
     */
    platformId: 4,
    /**
     * [adminPlatformId 慧营管理平台id]
     * @type {Number}
     */
    adminPlatformId: 3,
    /**
     * [advPlatformId 广告投放平台id]
     * @type {Number}
     */
    advPlatformId: 2,
    /**
     * [agentPlatformId 代理商平台id]
     * @type {Number}
     */
    agentPlatformId: 4,

    /**
     * @description 是否使用国际化，默认为false
     *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
     *              用来在菜单中显示文字
     */
    useI18n: false,
    /**
     * @description api请求基础路径
     */
    APIUrl: {
        dev: { // 开发环境 - 切换到灰度环境
            baseUrl: 'http://agent.dev.deemob.com', // 基础请求接口
            userBaseUrl: 'http://user.dev.deemob.com', // dsp用户中心 - 开发环境
            mediaComUrl: 'http://media.dev.deemob.com', // ssp媒体平台， 用于图片上传
            advComUrl: 'http://adv.dev.deemob.com', // dsp广告主平台
            operateComUrl: 'http://operate.dev.deemob.com', // dsp广告主管理
            agentComUrl: 'http://agent.dev.deemob.com' // dsp代理商管理
        },
        deving: { // 开发环境
            baseUrl: 'http://agent.dev.deemob.com', // 基础请求接口
            userBaseUrl: 'http://user.dev.deemob.com', // dsp用户中心 - 开发环境
            mediaComUrl: 'http://media.dev.deemob.com', // ssp媒体平台， 用于图片上传
            advComUrl: 'http://adv.dev.deemob.com', // dsp广告主平台
            operateComUrl: 'http://operate.dev.deemob.com', // dsp广告主管理
            agentComUrl: 'http://agent.dev.deemob.com' // dsp代理商管理
        },
        testing: { // 测试服务器
            baseUrl: 'http://agent.test.deemob.com', // 基础请求接口
            userBaseUrl: 'http://user.test.deemob.com', // dsp用户中心 - 测试环境
            mediaComUrl: 'http://media.test.deemob.com', // ssp媒体平台， 用于图片上传
            advComUrl: 'http://adv.test.deemob.com', // dsp广告主平台
            operateComUrl: 'http://operate.test.deemob.com', // dsp广告主管理
            agentComUrl: 'http://agent.test.deemob.com' // dsp代理商管理
        },
        gray: { // 灰度
            baseUrl: 'https://agent.gray.deemob.com', // 基础请求接口
            userBaseUrl: 'https://user.gray.deemob.com', // dsp用户中心 - 测试环境
            mediaComUrl: 'https://media.gray.deemob.com', // ssp媒体平台， 用于图片上传
            advComUrl: 'https://adv.gray.deemob.com', // dsp广告主平台
            operateComUrl: 'https://operate.gray.deemob.com', // dsp广告主管理
            agentComUrl: 'https://agent.gray.deemob.com' // dsp代理商管理
        },
        pro: { // 正式服务器
            baseUrl: 'https://agent.deemob.com', // 基础请求接口
            userBaseUrl: 'https://user.deemob.com', // dsp用户中心 - 测试环境
            mediaComUrl: 'https://media.deemob.com', // ssp媒体平台， 用于图片上传
            advComUrl: 'https://adv.deemob.com', // dsp广告主平台
            operateComUrl: 'https://operate.deemob.com', // dsp广告主管理
            agentComUrl: 'https://agent.deemob.com' // dsp代理商管理
        }
    },
    /**
     * [xlsApiUrl 模板xls路径  模板api 接口 ，区分(dev,test) 和 (gray, product)]
     * @type {Object}
     */
    xlsApiUrl: {
        dev: 'http://static.test.deemob.com/platform/dsp', // dev和test使用
        pro: 'https://static.deemob.com/platform/dsp' // gray和production使用
    },
    /**
     * @description 默认打开的首页的路由name值，默认为home
     */
    homeName: 'home',
    /**
     * @description 需要加载的插件
     */
    plugin: {
        'error-store': {
            showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
            developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
        }
    },
    /**
     * [noDataText table 数据为空时显示的提示内容]
     * @type {String}
     */
    noDataText: '暂无数据',
    /**
     * [dataNoPer 访问列表403权限]
     * @type {String}
     */
    noDataTextPer: '暂无权限',
    /**
     * [verifyText description]
     * @type {String}
     */
    verifyText: '必填项不完整'
}
