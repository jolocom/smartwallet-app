// @ts-ignore missing declaration file
import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock'

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

jest.mock('../../src/hooks/sdk', () => ({
  useAgent: () => ({
    initWithMnemonic: jest.fn().mockResolvedValue(true),
  }),
}))

jest.mock('react-native-randombytes', () => ({
  randomBytes: jest.fn().mockResolvedValue('sdsd'),
}))

// TODO: shouldn't really have to mock error codes :)
jest.mock('react-native-jolocom', () => ({
  SDKError: {
    codes: {
      ParseJWTFailed: 'ParseJWT',
    },
  },
}))

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage)
