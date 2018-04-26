const path = require('path')

module.exports = ({ platform }, { module, resolve }) => ({
  entry: `./index.js`,
  module: {
    ...module,
    rules: [
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
  },
  externals: ['sqlite3', 'pg', 'tedious', 'pg-hstore']
});
