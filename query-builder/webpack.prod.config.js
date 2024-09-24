/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const { configure: webpackConfigApp } = require('@jotforminc/webpack-config-app');

const config = webpackConfigApp({
  environment: 'production',
  generateSourcemap: false,
  env: {
    NODE_ENV: 'production'
  },
  webpack: {
    externals: [
      'react',
      'react-dom'
    ]
  }
});

config.cache({
  name: 'query-builder',
  type: 'filesystem',
  buildDependencies: {
    // This makes all dependencies of this file - build dependencies
    config: [__filename]
  },
  cacheDirectory: path.resolve(__dirname, '../../../.cache/webpack_5_87_0_a')
});

// console.log(require('util').inspect(config.toConfig(), false, 10, true));

module.exports = config.toConfig();
