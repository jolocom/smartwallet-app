jest.autoMockOff()
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
}))
