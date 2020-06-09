jest.mock('react-native-keychain', () => ({
  SECURITY_LEVEL_ANY: 'MOCK_SECURITY_LEVEL_ANY',
  SECURITY_LEVEL_SECURE_SOFTWARE: 'MOCK_SECURITY_LEVEL_SECURE_SOFTWARE',
  SECURITY_LEVEL_SECURE_HARDWARE: 'MOCK_SECURITY_LEVEL_SECURE_HARDWARE',
  setGenericPassword: jest.fn().mockResolvedValue(true),
  getGenericPassword: jest.fn().mockResolvedValue(true),
  resetGenericPassword: jest.fn().mockResolvedValue(true),
}))

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}))

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}))

jest.mock('../../src/utils/sdk/context', () => ({
  useSDK: () => ({
    bemw: {
      initWithMnemonic: jest.fn().mockResolvedValue(true),
    },
  }),
}))

// TODO remove when something is imported. Used b/c of the --isolatedModules issue
export {}
