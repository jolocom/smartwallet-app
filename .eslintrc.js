module.exports = {
  env: {
    es6: true, // ???
    'react-native/react-native': true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2018, // ???
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    'react-native',
    '@typescript-eslint',
    'import',
    'prettier',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    // React
    'react/prop-types': 'off',

    // React-Native
    'react-native/no-raw-text': 'off',

    // Prettier
    // Report prettier errors as an ESLint error
    'prettier/prettier': 'error',

    // Typescript
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
  reportUnusedDisableDirectives: true,
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
    react: {
      version: 'detect',
    },
  },
}
