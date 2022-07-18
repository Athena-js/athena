const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { isProd } = require('./_utils');

const plugins = [
  new CleanWebpackPlugin(),
  new ForkTsCheckerWebpackPlugin({
    async: false
  }),
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash:8].css'
  })
];

if (isProd) {
  // prod only plugins
  plugins.push(...[new BundleAnalyzerPlugin()]);
} else {
  // dev only plugins
  plugins.push(...[new FriendlyErrorsWebpackPlugin()]);
}

module.exports = plugins;
