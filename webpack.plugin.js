const { resolve } = require("path");
const webpack = require('webpack');
const ZipPlugin = require('zip-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackChromeReloaderPlugin = require("./webpack-chrome-extension-reloader");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const API = process.env.API;
const TABS = process.env.TABS;
const CLICK = process.env.CLICK;
const MODE = process.env.NODE_ENV;
const BE_ADDRESS = process.env.BE_ADDRESS;
const SEGMENTATION = process.env.SEGMENTATION;

if (!MODE || !BE_ADDRESS || !API || !SEGMENTATION || !TABS || !CLICK) {
  console.log('-------------');
  console.log('MODE: ' + MODE);
  console.log('API: ' + API);
  console.log('BE_ADDRESS: ' + BE_ADDRESS);
  console.log('SEGMENTATION: ' + SEGMENTATION);
  console.log('TABS: ' + TABS);
  console.log('CLICK: ' + CLICK);
  console.log('-------------');
  throw Error('Bad Config')
}

console.log("APPLICATION RUNNING IN MODE:", MODE);
console.log();

module.exports = {
  mode: MODE,
  devtool: MODE === 'production' ? false : "inline-source-map",
  entry: {
    "content-script":
      "./plugin-src/content-script.js",
    background: "./plugin-src/background.js",
    // This is just the popup script, it shouldn't trigger the plugin reload when is changed
    popup: "./plugin-src/popup.js"
  },
  output: {
    publicPath: "F.",
    path: resolve(__dirname, "dist/"),
    filename: "[name].js",
    libraryTarget: "umd"
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  plugins: [
    new webpack.DefinePlugin({
      API: JSON.stringify(API),
      TABS: JSON.stringify(TABS),
      CLICK: JSON.stringify(CLICK),
      BE_ADDRESS: JSON.stringify(BE_ADDRESS),
      SEGMENTATION: JSON.stringify(SEGMENTATION)
    }),
    new WebpackChromeReloaderPlugin(),
    new MiniCssExtractPlugin({ filename: "style.css" }),
    new CopyWebpackPlugin([
      { from: "./plugin-src/popup.html" },
      { from: "./plugin-src/nouislider" },
      { from: "./plugin-src/images" },
      { from: "./manifest.json" },
      { from: "./icons" }
    ]),
    new ZipPlugin({
      filename: 'clickbait_filtering_plugin.zip',
      include: [/\.*$/]
    })
  ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [require("@babel/preset-env")]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader"
        ]
      },
      {
        test: /\.txt$/,
        use: "raw-loader"
      }
    ]
  }
};
