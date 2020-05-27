jest.autoMockOff()
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
}))
