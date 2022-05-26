module.exports = {
  env: {
    es6: true, // ???
    'react-native/react-native': true,
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    // ESLint recommended
    'no-unused-vars': 'warn',
    'no-useless-escape': 'off',

    // Import
    'import/no-named-as-default-member': 'off',
    'import/no-named-as-default': 'off',

    // React
    'react/prop-types': 'off',
    //'react/display-name': 'warn', // TODO: make it an "error"
    'react/display-name': 'off',
    'react/no-children-prop': 'off',

    // React-Native
    'react-native/no-raw-text': 'off',
    'react-native/no-inline-styles': 'off',
    'react-native/sort-styles': 'off',
    'react-native/no-color-literals': 'warn',

    // Typescript
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/require-await': 'warn',
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
