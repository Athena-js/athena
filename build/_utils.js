const path = require('path');

module.exports = {
  isProd: process.env.NODE_ENV === 'production',
  resolve: (...args) => path.resolve(__dirname, '../', ...args)
};
