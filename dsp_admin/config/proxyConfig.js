module.exports = {
    '/api/v1': { // 普通接口 开发
        // target: 'http://operate.dev.deemob.com/api/v1', // 代理到gray环境
        target: 'https://operate.gray.deemob.com/api/v1', // 代理到gray环境
        changeOrigin: true,
        pathRewrite: {
            '^/api/v1': ''
        }
    },
    '/uc_api/v1': { // 用户接口 - 代理
        // target: 'http://operate.dev.deemob.com/uc_api/v1',
        target: 'https://operate.gray.deemob.com/uc_api/v1',
        changeOrigin: true,
        pathRewrite: {
            '^/uc_api/v1': ''
        }
    },
    '/mock': {
        target: 'http://127.0.0.1:9091/mock', // 代理到dev环境
        changeOrigin: true,
        pathRewrite: {
            '^/mock': ''
        }
    }
}
