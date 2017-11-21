const merge = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')

const common = require('./webpack.config.common.js')
module.exports = merge(common, {
  devtool: 'eval',
  resolve: {
    alias: {
      settings: path.resolve(__dirname, 'config', 'development.js')
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({ 'IDENTITY_GATEWAY_URL': getGatewayUri() })
  ]
})

function getGatewayUri() {
  const { USE_LOCAL_GATEWAY, IDENTITY_GATEWAY_URL } = process.env
  if (USE_LOCAL_GATEWAY) {
    return '"http://localhost:5678"'
  }
  return IDENTITY_GATEWAY_URL ? `"${IDENTITY_GATEWAY_URL}"` : '""'
}
