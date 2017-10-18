const path = require('path'),
      fs = require('fs'),
      webpack = require('webpack'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      CleanWebpackPlugin = require('clean-webpack-plugin')
 
      let nodeModules = {}
      fs.readdirSync('node_modules').forEach(function(module) {
        nodeModules[module] = `require('${module}')`
      })
      
module.exports = {

entry: {
main: [
'webpack-dev-server/client?http://localhost:8080',
'webpack/hot/only-dev-server',
'react-hot-loader/patch',
'./src/js/main.jsx'
],
vendor: [
'babel-polyfill',
'whatwg-fetch',
]
},
output: {
path: path.resolve(__dirname, 'dist'),
filename: '[name].js'
},
module: {
rules: [
{ 
  test: /\.jsx?$/, 
  include: [
    path.resolve(__dirname, 'src/js'),
    path.resolve(__dirname, 'test'),
    path.resolve(__dirname, 'node_modules/ethereumjs.-tx')
  ],
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader'
  }
}
]
},
devServer: {
stats: {
errorDetails: true
}
},
resolve: {
modules: [
path.resolve(__dirname, 'src/js'),
path.resolve(__dirname, 'node_modules'),
path.resolve(__dirname, 'node_modules/ethereumjs.-tx')
],
extensions: ['*','.js', '.jsx', '.json'],
alias: {
  'actions': 'actions',
  'components': 'components',
  'stores': 'stores',
  'lib': 'lib',
  'styles': 'styles',
  'routes': path.resolve(__dirname, '/src/js/routes/default.jsx'),
  'settings': path.resolve(__dirname) + '/config/development.js'
}
},
externals: [{
  // nodeModules
  xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}',
  'cheerio': 'window',
  'react/lib/ExecutionEnvironment': true,
  'react/lib/ReactContext': true,
  'react/addons': true
}]
// plugins: [
// new webpack.HotModuleReplacementPlugin(),
// new webpack.LoaderOptionsPlugin({
//   debug: true
// }),
// new HtmlWebpackPlugin({
//   title: 'Output Management'
// }),
// new webpack.DefinePlugin({
// 'IDENTITY_GATEWAY_URL': process.env.IDENTITY_GATEWAY_URL
// ? '"' + process.env.IDENTITY_GATEWAY_URL + '"'
// : '"' + defaultGatewayUrl + '"'
// })
// ]
}
