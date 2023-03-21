const config = require("./config");
const commonConfig = require("./webpack.common.config.js");
const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const devConfig = {
  cache: {
    type: "filesystem",
  },
  mode: "development",
  devtool: config.dev.devtool, //开启相应SourceMap模式,加了导致热更新减慢
  entry: {
    app: [path.join(__dirname, "../app/index.js")],
  },
  output: {
    path: path.resolve(__dirname, config.dev.assetsRoot),
    publicPath: config.dev.assetsPublicPath,
    filename: "[name].js?[hash]",
    chunkFilename: "[name].js?[hash]",
    pathinfo: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          "thread-loader",
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
    ],
  },
  devServer: {
    //webpack-server配置（仅开发环境需要）
    host: config.dev.host, //host设置 0.0.0.0 可供外部访问
    port: config.dev.port, //端口设置
    static: {
      publicPath: config.dev.assetsPublicPath,
      directory: path.join(__dirname, "../dist"), //虚拟存储路径，开发环境放在内存
    },
    proxy: config.dev.proxyTable, //代理列表
    historyApiFallback: true, //开启history模式
    allowedHosts: "all", //关闭host检查
    compress: true, //启动压缩
    hot: true, //热加载
    open: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  optimization: {
    moduleIds: "named",
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 热替换插件
    new ReactRefreshWebpackPlugin(),
    new webpack.DefinePlugin({
      //环境变量装配
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development"),
        NODE_APIENV: JSON.stringify(process.env.NODE_APIENV || "development"),
      },
    }),
    // new CopyWebpackPlugin([
    //   {
    //     //设置静态路径的文件全拷贝
    //     from: path.resolve(__dirname, "../static"),
    //     to: path.posix.join("static"),
    //     ignore: [".*"],
    //   },
    // ]),
  ],
};

const mergeConfig = merge({
  //commonConfig与devConfig合并导出
  customizeArray(a, b, key) {
    /*入口app放弃合并, 采用全替换*/
    if (key === "entry.app") {
      return b;
    }
    return undefined;
  },
})(commonConfig, devConfig);

module.exports = mergeConfig;
