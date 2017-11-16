const fs = require('fs')
const path = require('path')

const nodeModules = {}
fs.readdirSync('node_modules').forEach(function(module) {
  nodeModules[module] = `require('${module}')`
})

module.exports = {
  target: 'node',
  externals: nodeModules,
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json'],
    alias: {
      components: path.resolve(__dirname, 'src/js/components'),
      lib: path.resolve(__dirname, 'src/js/lib'),
      redux_state: path.resolve(__dirname, 'src/js/redux_state'),
      services: path.resolve(__dirname, 'src/js/services'),
      styles: path.resolve(__dirname, 'src/js/styles'),
      routes: path.resolve(__dirname, 'src/js/routes'),
      settings: path.resolve(__dirname, 'config/test.js')
    }
  },
  module: {
    noParse: [
      /node_modules\/sinon/
    ],
    loaders: [{
      test: /\.jsx?/,
      loader: 'babel-loader',
      include: [
        path.resolve(__dirname, 'test'),
        path.resolve(__dirname, 'node_modules/ethereumjs-tx'),
        path.resolve(__dirname, 'src/js')
      ]
    }]
  }
}
