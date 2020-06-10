module.exports = {
  preset: '@testing-library/react-native',
  setupFiles: [
    './__tests__/utils/setup.ts',
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  testPathIgnorePatterns: ['./node_modules/.*', './__tests__/utils/.*'],
}
