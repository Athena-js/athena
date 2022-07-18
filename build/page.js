const CopyPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const rules = require('./_rules');
const plugins = require('./_plugins');
const baseConfig = require('./_basic');
const { isProd, resolve } = require('./_utils');

/** @type {import('webpack').Configuration)} */
module.exports = {
  ...baseConfig,
  entry: resolve('src/page/index.ts'),
  output: {
    path: resolve('dist'),
    filename: '[name].[contenthash:8].js'
  },
  module: { rules },
  plugins: [
    ...plugins,
    new CopyPlugin({
      patterns: [{ from: resolve('./public/static'), to: resolve('./dist/static') }]
    }),
    new HTMLWebpackPlugin({
      template: resolve('public/index.html')
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: 'vendors',
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: 'single'
  },
  devServer: {
    static: resolve('dist'),
    compress: true,
    client: {
      logging: 'error'
    },
    port: 4000,
    historyApiFallback: true
  }
};
