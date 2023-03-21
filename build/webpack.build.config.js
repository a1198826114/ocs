const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const commonConfig = require("./webpack.common.config.js");
const config = require("./config");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin"); //启用GZIP压缩
const publicConfig = {
  mode: "production",
  devtool: config.build.devtool,
  entry: {
    app: [path.join(__dirname, "../app/index.js")],
  },
  output: {
    pathinfo: false,
    path: config.build.assetsRoot,
    publicPath: config.build.assetsPublicPath,
    filename: "js/[name].[chunkhash:8].js",
    chunkFilename: "js/[name].[chunkhash:8].js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
    ],
  },
  optimization: {
    nodeEnv: "production",
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        cache: "./.cache/terser", //缓存
        parallel: true, //多线程
        terserOptions: {
          warnings: false,
          compress: {
            unused: true,
            dead_code: true,
            drop_console: true,
            drop_debugger: true,
          },
          output: {
            ecma: 5,
            comments: false, //不保留注释
            beautify: false, //不需要格式化
          },
        },
      }),
      new CssMinimizerWebpackPlugin(), // 压缩输出的 css 代码
    ],
    runtimeChunk: "single",
    splitChunks: {
      //分离入口文件中的JS库默认文件名[入口~vendor-hash.js]
      chunks: "all", //匹配文件无论是否动态模块，都打包进该vendor
      minSize: 30000, //当模块大于minSize时，进行代码分割
      minChunks: 1, // 重复1次才能打包到此模块
      maxAsyncRequests: 12, //同时加载的模块数
      maxInitialRequests: 12, //最大初始化加载次数，入口文件可以并行加载的最大文件数量。
      name: false,
      cacheGroups: {
        vendor: {
          // split `node_modules`目录下被打包的代码到 `js/chunks/vendor.js
          test: /[\\/]node_modules[\\/]/, // 匹配对应文件
          chunks: "initial", // 只对入口文件处理
          name: "chunks/vendor",
          priority: 1, // 优先级配置，优先匹配优先级更高的规则，不设置的规则优先级默认为0
          enforce: true,
          reuseExistingChunk: true, // 可设置是否重用该chunk
        },
        rxjs: {
          test: /[\\/]node_modules[\\/](rxjs)[\\/]/,
          name: "chunks/rxjs",
          chunks: "all",
          priority: 5,
          minChunks: 1,
          reuseExistingChunk: true,
        },
        antd: {
          test: /[\\/]node_modules[\\/](antd)[\\/]/,
          name: "chunks/antd",
          chunks: "all",
          priority: 5,
          minChunks: 1,
          reuseExistingChunk: true,
        },
        moment: {
          test: /[\\/]node_modules[\\/](moment)[\\/]/,
          name: "chunks/moment",
          chunks: "all",
          priority: 5,
          minChunks: 1,
          reuseExistingChunk: true,
        },
        lodash: {
          test: /[\\/]node_modules[\\/](lodash)[\\/]/,
          name: "chunks/lodash",
          chunks: "all",
          priority: 5,
          minChunks: 1,
          reuseExistingChunk: true,
        },
        // 单独分离node_modules里面共用的异步模块，
        common_vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "async",
          minChunks: 2,
          priority: 4,
          reuseExistingChunk: true,
          enforce: true,
        },
        // 单独分离项目里面共用的业务组件，
        common_app: {
          test: /[\\/]app[\\/]/,
          chunks: "async",
          minChunks: 2,
          priority: 4,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      //环境变量装配
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || "production"),
        NODE_APIENV: JSON.stringify(process.env.NODE_APIENV || "development"),
      },
    }),
    new CopyWebpackPlugin([
      {
        //文件拷贝
        from: path.resolve(__dirname, "../static"),
        to: path.posix.join("static"),
        ignore: [".*"],
      },
      {
        from: path.resolve(__dirname, "./dist"),
        to: path.resolve(__dirname, "../dist"),
      },
    ]),
    // new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({
      //CSS提取
      ignoreOrder: true,
      filename: "css/[name].[contenthash:8].css", // 打包出来的文件名字
      chunkFilename: "css/[name].[contenthash:8].css", // 分割出来的单个文件的文件名
    }),

    // 分离不同时区的moment代码
    new MomentLocalesPlugin({
      localesToKeep: ["zh-cn"],
    }),
    new CompressionWebpackPlugin({
      //将打包好的文件压缩打包为gizp，默认未开启，采用Nginx压缩
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: new RegExp(
        "\\.(" + config.build.productionGzipExtensions.join("|") + ")$"
      ),
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: config.build.deleteOriginalAssets,
    }),
  ],
  stats: {
    children: false,
    builtAt: true,
    colors: true,
    errors: true,
  },
};

module.exports = merge({
  customizeArray(a, b, key) {
    /*entry.app不合并，全替换*/
    if (key === "entry.app") {
      return b;
    }
    return undefined;
  },
})(commonConfig, publicConfig);
