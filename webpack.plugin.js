const { resolve } = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackChromeReloaderPlugin = require("../dist/webpack-chrome-extension-reloader");

const mode = process.env.NODE_ENV;

console.log("APPLICATION RUNNING IN MODE:", mode);
console.log();

module.exports = {
  mode,
  devtool: "inline-source-map",
  entry: {
    "content-script":
      "./click_bait_filter_extension/plugin-src/my-content-script.js",
    background: "./click_bait_filter_extension/plugin-src/my-background.js",
    // This is just the popup script, it shouldn't trigger the plugin reload when is changed
    popup: "./click_bait_filter_extension/plugin-src/popup.js"
  },
  output: {
    publicPath: "F.",
    path: resolve(__dirname, "dist/"),
    filename: "[name].js",
    libraryTarget: "umd"
  },
  plugins: [
    /***********************************************************************/
    /* By default the plugin will work only when NODE_ENV is "development" */
    /***********************************************************************/
    new WebpackChromeReloaderPlugin(),

    new MiniCssExtractPlugin({ filename: "style.css" }),
    new CopyWebpackPlugin([
      { from: "./click_bait_filter_extension/plugin-src/popup.html" },
      { from: "./click_bait_filter_extension/plugin-src/nouislider" },
      { from: "./click_bait_filter_extension/plugin-src/images" },
      { from: "./click_bait_filter_extension/manifest.json" },
      { from: "./click_bait_filter_extension/icons" }
    ])
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
