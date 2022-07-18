const rules = require('./_rules');
const plugins = require('./_plugins');
const baseConfig = require('./_basic');
const { isProd, resolve } = require('./_utils');

/** @type {import('webpack').Configuration)} */
module.exports = {
  ...baseConfig,
  entry: resolve('src/index.ts'),
  output: {
    library: 'Athena',
    libraryTarget: 'umd',
    filename: 'index.js',
    path: resolve('dist')
  },
  watch: !isProd,
  module: { rules },
  plugins,
  externals: {}
};
