const webpack = require('webpack')
const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const merge = require('webpack-merge')

const common = require('./webpack.config.common.js')
module.exports = merge(common, {
  resolve: {
    alias: {
      settings: path.resolve(__dirname, 'config', 'production.js')
    }
  },
  plugins: [
    new UglifyJSPlugin(),
    new webpack.DefinePlugin({
      'NODE_ENV': '"production"',
      'IDENTITY_GATEWAY_URL': getGatewayUri()
    })
  ]
})

function getGatewayUri() {
  const { TIER } = process.env
  return TIER === 'staging'
    ? '"https://staging.identity.jolocom.com"'
    : '"https://identity.jolocom.com"'
}
