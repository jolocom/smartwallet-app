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
    //'no-unused-vars': 'warn',

    // React
    'react/prop-types': 'off',
    //'react/display-name': 'warn', // TODO: make it an "error"
    'react/no-children-prop': 'off',

    // React-Native
    'react-native/no-raw-text': 'off',
    'react-native/no-inline-styles': 'off',
    'react-native/sort-styles': 'off',
    'react-native/no-color-literals': 'warn',

    // Typescript
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/require-await': 'warn',

    // Tentative
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    'no-unused-vars': 'off',
    'import/no-unresolved': 'off',
    'import/no-duplicates': 'off',
    'prettier/prettier': 'off',
    'react/display-name': 'off',
    'react/jsx-key': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
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
