
const path = require('path')

module.exports = {
  dev: {
    assetsRoot: 'dist',   //打包文件路径
    assetsPublicPath: '/', //webAPP根路径 (如果同一个域名下多项目则要配置文件名来区分项目)
    proxyTable: {   //代理列表 支持多个代理(解决跨域问题)
      '/api': {
          target: 'http://dev-user-api.wanshifu.com/',
          changeOrigin: true,
          withCredentials: true,
          secure: false,
          pathRewrite: { '^/api': '' }
      }
    },
    autoOpenBrowser: true,
    host: 'localhost-user.wanshifu.com',
    port: 8082,
    devtool: 'eval-source-map',
    sourceMap: true
  },
  build: {
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsPublicPath: '/',//webAPP根路径 (如果同一个域名下多项目则要配置文件名来区分项目)
    sourceMap: false,
    devtool: "hidden-source-map",
    // productionGzip: false,  //是否压缩启用 运维ngix有做压缩,这里没配压缩
    productionGzipExtensions: ['js', 'css'],  //压缩启用-压缩的内容
    deleteOriginalAssets : true  //压缩启用-删除压缩的源文件
  }
}
