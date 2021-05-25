import config from '@/config'

var APIUrl = '' // 所有的api 接口
var xlsAPIUrl = '' // 模板api 接口 ，区分(dev,test) 和 (gray, product)

switch (process.env.NODE_ENV) {
    case 'development': // 开发
        APIUrl = config.APIUrl.dev
        xlsAPIUrl = config.xlsApiUrl.dev
        break
    case 'production': // 生产
        APIUrl = config.APIUrl.pro
        xlsAPIUrl = config.xlsApiUrl.pro
        break
    case 'testing': // test
        APIUrl = config.APIUrl.testing
        xlsAPIUrl = config.xlsApiUrl.dev
        break
    case 'deving': // dev
        APIUrl = config.APIUrl.deving
        xlsAPIUrl = config.xlsApiUrl.dev
        break
    case 'gray': // 灰度
        APIUrl = config.APIUrl.gray
        xlsAPIUrl = config.xlsApiUrl.gray
        break
}

export {
    APIUrl,
    xlsAPIUrl
}
