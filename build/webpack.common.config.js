const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

//打印校对当前启动的环境
const isDev = process.env.NODE_ENV === "development";

const resolve = function (dir) {
  return path.join(__dirname, "..", dir);
};

const commonConfig = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          { loader: "thread-loader" },
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: isDev ? resolve(".cache") : false, //生成cache缓存文件,提高编绎速度
              cacheCompression: true,
              babelrc: true,
              compact: true,
              plugins: [isDev && require.resolve("react-refresh/babel")].filter(
                Boolean
              ),
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10000,
          },
        },
        generator: {
          filename: "[path][name].[ext]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        exclude: path.resolve(__dirname, "../node_modules"),
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10000,
          },
        },
        generator: {
          filename: "fonts/[name].[ext]",
        },
      },
    ],
  },
  plugins: [
    // 生成打包后index.html
    new HtmlWebpackPlugin({
      filename: "index.html",
      // favicon: "app/assets/images/favicon.ico",
      hash: true,
      template: resolve(`index.html`),
    }),
    new Dotenv({
      //读取对应环境变量,全部装配进来
      path: path.resolve(`./build/env/.env.${process.env.NODE_APIENV}`),
      safe: false,
      systemvars: false,
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime/]),
    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: path.resolve(__dirname, "./dist/main.manifest.json"),
    // }),
    new webpack.ProvidePlugin({
      process: "process/browser", //Webpack5 移除了 Node.js 模块的 Polyfills,如果第三方模块引用了 cypto、process 这些模块,需要启用这个
    }),
    new NodePolyfillPlugin(),
  ],
  externals: {
    xlsx: "window.XLSX",
  },
  resolve: {
    alias: {},
    extensions: [".js", ".jsx", ".json"],
  },
};
module.exports = commonConfig;
