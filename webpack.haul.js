const path = require('path')

module.exports = ({ platform }, { module, resolve }) => ({
  entry: `./index.js`,
  module: {
    ...module,
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules\/(?!(typeforce|base64url|jsonld|rdf-canonize|tiny-secp256k1|bip32|asn1.js|key-encoder\/node_modules\/asn1.js)\/).*/,
        loader: 'babel-loader'
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: ['babel-inline-import-loader', 'babel-loader']
      },
      {
        test: /\.xml$/,
        exclude: /node_modules/,
        use: ['babel-inline-import-loader', 'babel-loader']
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
      'react-native': path.join(__dirname, 'node_modules/react-native')
    },
    extensions: [
      `.${platform}.ts`,
      `.${platform}.tsx`,
      '.ts',
      '.tsx',
      '.native.ts',
      '.native.tsx',
      ...resolve.extensions
    ]
  }
})
