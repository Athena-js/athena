const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { resolve } = require('./_utils');

/** @type {import('webpack').RuleSetRule[])} */
module.exports = [
  {
    test: /\.(ts|js)x?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript']
      }
    }
  },
  {
    test: /\.less$/i,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          modules: {
            mode: 'local',
            auto: true,
            exportGlobals: true,
            localIdentName: '[local]_[hash:base64:5]',
            localIdentContext: resolve('src'),
            localIdentHashSalt: 'Vincent Wang'
          }
        }
      },
      'less-loader'
    ]
  }
];
