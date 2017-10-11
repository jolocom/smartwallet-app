const path = require('path'),
      webpack = require('webpack')

module.exports = {
  entry: {
    main: './src/js/main.jsx',
    vendor: [
      'babel-polyfill',
      'whatwg-fetch'
    ]
  },
  resolve: {
    alias: {
      actions: 'actions',
      components: 'components',
      stores: 'stores',
      lib: 'lib',
      styles: 'styles',
      settings: path.resolve(__dirname) + '/config/production.js'
    },
    extensions: ['*', '.js', '.jsx', '.json'],
    modules: [
      path.resolve(__dirname) + '/src/js'
    ],
    plugins: [
      new webpack.DefinePlugin({
        'IDENTITY_GATEWAY_URL': process.env.TIER === 'staging'
        ? '"https://staging.identity.jolocom.com"'
        : '"https://identity.jolocom.com"'
      })
    ]
  },
  output: {
    path: path.resolve(__dirname) + '/dist/js',
    filename: 'bundle.js',
    publicPath: 'js/'
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
      }
    ]  
  }
}
