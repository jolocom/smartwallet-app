module.exports = {
  preset: 'react-native',
  setupFiles: [
    './__tests__/utils/setup.ts',
    './node_modules/react-native-gesture-handler/jestSetup.js',
    // './node_modules/react-native-reanimated/src/reanimated2/jestUtils.js',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  testPathIgnorePatterns: [
    './node_modules/.*',
    './__tests__/utils/.*',
    './__tests__/mocks/.*',
    './src/assets/svg/',
    '/node_modules/(?!(react-native|@sentry/react-native)/)',
  ],
  transformIgnorePatterns: ['node_modules/(?!static-container)/'],
}
