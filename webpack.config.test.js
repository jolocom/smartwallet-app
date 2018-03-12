const fs = require('fs')
const path = require('path')

const common = require('./webpack.config.common.js')
const nodeModules = {}
fs.readdirSync('node_modules').forEach(function(module) {
  nodeModules[module] = `require('${module}')`
})

module.exports = {
  target: 'node',
  externals: nodeModules,
  resolve: {
    extensions: common.resolve.extensions,
    alias: Object.assign(common.resolve.alias, {
      settings: path.resolve(__dirname, 'config/test.js')
    })
  },
  plugins: [],
  module: {
    noParse: [
      /node_modules\/sinon/
    ],
    loaders: [{
      test: /\.jsx?/,
      loader: 'babel-loader',
      include: [
        path.resolve(__dirname, 'test'),
        path.resolve(__dirname, 'src/js')
      ]
    }]
  }
}
