/* 代理对象 */
let proxyObj = {}

/*拦截Http请求 */
proxyObj['/permission'] = {
    ws: false,
    /* 目标的转发地址，就是将拦截的Http请求转发到哪里去 */
    target: 'http://localhost:8001',
    changeOrigin: true,
    /* 请求地址要不要重写 */
    pathRewrite: {
        /* 不修改 */
        '^/permission': ''
    }
}

module.exports = {

    /* 开发环境 */
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: proxyObj
    }
}
