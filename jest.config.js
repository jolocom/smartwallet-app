module.exports = {
  preset: '@testing-library/react-native',
  setupFiles: ['./__tests__/utils/setup.ts'],
  testPathIgnorePatterns: ['./node_modules/.*', './__tests__/utils/.*'],
}
