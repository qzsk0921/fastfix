const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')

const resolve = function (dir) {
  return path.resolve(__dirname, '..', dir)
}

const config = merge(baseWebpackConfig, {
  output: {
    path: resolve('dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/'
  },
  mode: 'development',
  devServer: {
    contentBase: 'dist',
    compress: true,
    port: '3000',
    // host: '192.168.1.135',
    host: 'localhost',
    stats: {
      maxModules: 0,
      children: false,
      entrypoints: false,
      version: false,
      hash: false
    },
    proxy: {
      '/api/**': {
        target: 'localhost:3001',
        secure: false,
        changeOrigin: true
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev')
    })
  ]
})

module.exports = config