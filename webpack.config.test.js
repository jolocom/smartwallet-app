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
    extensions: ['', '.js', '.jsx', '.json'],
    root: path.join(__dirname, 'src', 'js'),
    alias: {
      actions: 'actions',
      components: 'components',
      stores: 'stores',
      lib: 'lib',
      styles: 'styles',
      settings: path.join(__dirname, 'config', 'test.js')
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
        path.join(__dirname, 'src', 'js'),
        path.join(__dirname, 'test'),
        path.join(__dirname, 'node_modules', 'ethereumjs-tx')
      ]
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  }
}