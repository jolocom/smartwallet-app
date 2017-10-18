var fs = require('fs')
var path = require('path')

var nodeModules = {}
fs.readdirSync('node_modules').forEach(function(module) {
  nodeModules[module] = `require('${module}')`
})

module.exports = {
  target: 'node',
  externals: nodeModules,
  resolve: {
    modules: [
      path.resolve(__dirname, 'src/js'),
      path.resolve(__dirname, 'node_modules')
    ],
    extensions: ['*', '.js', '.jsx', '.json'],
    alias: {
      actions: 'actions',
      components: 'components',
      stores: 'stores',
      lib: 'lib',
      styles: 'styles',
      settings: path.resolve(__dirname, 'config/test.js')
    }
  },
  module: {
    noParse: [
      /node_modules\/sinon/
    ],
    rules: [{
      test: /\.jsx?/,
      include: [
        path.resolve(__dirname, 'src/js'),
        path.resolve(__dirname, 'test'),
        path.resolve(__dirname, 'node_modules/ethereumjs.-tx')
      ],
      use: {
        loader: 'babel-loader'
      }
    }]
  }
}
