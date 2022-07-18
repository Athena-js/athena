const { isProd, resolve } = require('./_utils');

/** @type {import('webpack').Configuration)} */
module.exports = {
  mode: isProd ? 'production' : 'development',
  stats: isProd ? 'normal' : 'none',
  devtool: isProd ? false : 'source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': resolve('src')
    }
  }
};
