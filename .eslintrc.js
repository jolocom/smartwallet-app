module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    // allows imports
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    // turn on eslint-plugin-prettier and eslint-config-prettier
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  rules: {
    'arrow-body-style': ['warn', 'as-needed'],
    // curly braces for if, else etc.
    curly: ['error', 'multi-line'],
    'default-case': ['error'],
    eqeqeq: ['error', 'smart'],
    // for...in will normally include properties in prototype chain, require if
    'guard-for-in': ['error'],
    // I don't think we even use labels
    'no-extra-label': ['error'],
    // not sure about this, but replaces tslint's `no-arg` rule
    'no-caller': ['error'],
    // transfered from tslint's `no-conditional-assignment` rule
    'no-cond-assign': ['error'],
    'no-debugger': ['error'],
    // similar to tslint's `no-construct` rule
    'no-new-wrappers': ['error'],
    // replacement for `no-string-throw`
    'no-throw-literal': ['error'],
    'no-unused-expressions': ['error'],
    'no-var': ['error'],
    // this isn't a tslint thing, but have copied over
    'new-parens': ['error'],
    'object-shorthand': ['error'],
    'prefer-arrow-callback': ['error'],
    'prefer-const': ['error'],
    semi: ['error', 'never'],
    'use-isnan': ['error'],
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          Object: 'Use {} instead.',
          String: "Use 'string' instead.",
          Number: "Use 'number' instead.",
          Boolean: "Use 'boolean' instead.",
        },
      },
    ],
    'react/jsx-uses-vars': ['warn'],
    // PascalCase for classes
    '@typescript-eslint/class-name-casing': ['off'],
    // don't prefix interface names with 'I'
    '@typescript-eslint/interface-name-prefix': ['off'],
    // don't conflict <Types> and JSX
    '@typescript-eslint/no-angle-bracket-type-assertion': ['off'],
    // lose out on typing benefits with any
    '@typescript-eslint/no-explicit-any': ['error'],
    '@typescript-eslint/no-empty-interface': ['off'],
    '@typescript-eslint/no-inferrable-types': ['error'],
    // namespaces and modules are outdated, use ES6 style
    '@typescript-eslint/no-namespace': ['error'],
    // use ES6-style imports instead
    '@typescript-eslint/no-triple-slash-reference': ['off'],
    '@typescript-eslint/no-var-requires': ['off'],
    '@typescript-eslint/no-use-before-define': ['off'],
    '@typescript-eslint/explicit-function-return-type': ['off'],
    'import/no-duplicates': ['off'],
  },
  ignorePatterns: ['package.json', 'gradle.properties'],
}
