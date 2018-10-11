const path = require('path')

module.exports = ({ platform }, { module, resolve }) => ({
  entry: `./index.js`,
  module: {
    ...module,
    rules: [{
        test: /\.js/,
        exclude: /node_modules\/(?!(base64url|jsonld|rdf-canonize)\/).*/,	
        loader: 'babel-loader'
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: [
          'babel-inline-import-loader',
          'babel-loader'
        ]
      },
      {
        test: /\.xml$/,
        exclude: /node_modules/,
        use: [
          'babel-inline-import-loader',
          'babel-loader'
        ]
      },
      {
        test: /\.tsx?$/,
        loader: 'babel-loader!ts-loader'
      },
      ...module.rules
    ]
  },
  resolve: {
    ...resolve,
    alias: {
      src: path.resolve(__dirname, 'src/'),
      react: path.join(__dirname, 'node_modules/react'),
      'react-native': path.join(__dirname, 'node_modules/react-native'),
    },
    extensions: [
      '.ts',
      '.tsx',
      `.${platform}.ts`,
      '.native.ts',
      `.${platform}.tsx`,
      '.native.tsx',
      ...resolve.extensions
    ]
  }
});
