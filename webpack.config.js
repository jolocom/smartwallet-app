const path = require('path'),
      webpack = require('webpack')

let defaultGatewayUrl = ''
if (process.env.USE_LOCAL_GATEWAY === 'true') {
  defaultGatewayUrl = 'http://localhost:5678'
}

module.exports = {
  entry: {
    main: './src/js/main.jsx',
    index: './src/index.html',
    vendor: [
      'babel-polyfill',
      'whatwg-fetch',
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server'
    ]
  },
  devServer: {
    stats: {
      errorDetails: true
    }
  },
  resolve: {
    alias: {
      actions: 'actions',
      components: 'components',
      stores: 'stores',
      lib: 'lib',
      styles: 'styles',
      routes: path.resolve(__dirname, '/src/js/routes/default.jsx'),
      settings: path.resolve(__dirname) + '/config/development.js'
    },
    extensions: ['*','.js', '.jsx', '.json'],
    modules: [
      path.resolve(__dirname) + '/src/js'
    ],
    plugins: [
      // new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'IDENTITY_GATEWAY_URL': process.env.IDENTITY_GATEWAY_URL
        ? '"' + process.env.IDENTITY_GATEWAY_URL + '"'
        : '"' + defaultGatewayUrl + '"'
      })
    ]
  },
  output: {
    path: path.join(__dirname, 'dist', 'js'),
    filename: 'bundle.js',
    publicPath: 'js'
  },
  externals: [{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }],
  module: {
    rules: [
      { 
        test: /\.jsx?$/, 
        include: [
          path.join(__dirname, 'src', 'js'),
          path.join(__dirname, 'test'),
          path.join(__dirname, 'node_modules', 'ethereumjs-tx')
        ],
        use: ['babel-loader'] 
      },
      { 
        test: /\.html$/, 
        use: ['file-loader'] 
      }
    ]
  }
}

