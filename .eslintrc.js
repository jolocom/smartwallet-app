module.exports = {
  env: {
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended', // yes
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    // 'airbnb',
    // Requires eslint-plugin-import package;
    // /errors and /warnings are combined in one rule set: plugin:import/recommended
    // 'plugin:import/errors',
    // 'plugin:import/warnings',
    // Below adds typescript support to eslint-plugin-import
    // 'plugin:import/typescript',
    'prettier',
    // 'prettier/react',
    // prettier/@typescript-eslint',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    // '__DEV__': 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json', // maybe
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
  rules: {
    // Typescript
    '@typescript-eslint/explicit-function-return-type': 'off',

    // React
    'react/prop-types': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
