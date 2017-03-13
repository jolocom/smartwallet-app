var path = require('path')

module.exports = {
  entry: [
    'whatwg-fetch',
    './src/js/main.jsx'
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    root: path.resolve(__dirname) + '/src/js',
    alias: {
      actions: 'actions',
      components: 'components',
      stores: 'stores',
      lib: 'lib',
      styles: 'styles',
      settings: path.resolve(__dirname) + '/config/production.js'
    }
  },
  output: {
    path: path.resolve(__dirname) + '/dist/js',
    filename: 'bundle.js',
    publicPath: 'js/'
  },
  externals: [{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }],
  plugins: [],
  module: {
    loaders: [{
      test: (abspath) => {
        var reg = /\.jsx?$/
        if (!reg.test(abspath)) {
          return false
        }

        reg = /.+\.test\.jsx?$/
        if (reg.test(abspath)) {
          return false
        }

        reg = /.+test/
        if (reg.test(abspath)) {
          return false
        }
        return true
      },
      loader: 'babel',
      include: [
        path.join(__dirname, 'src', 'js')
      ],
      exclude: [ /node_modules/, /test/, /\.test\.jsx?$/ ]
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  debug: true
}
