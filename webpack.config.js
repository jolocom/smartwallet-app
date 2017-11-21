const merge = require('webpack-merge')
const webpack = require('webpack')

const common = require('./webpack.config.common.js')
module.exports = merge(common, {
  devtool: 'eval',
  plugins: [ new webpack.HotModuleReplacementPlugin() ]
})
