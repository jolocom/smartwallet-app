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
    storage: {
      get: {
        setting: jest.fn().mockImplementation(() => ({type: ''}))
      }
    }
  }),
}))

jest.mock('react-native-randombytes', () => ({
  randomBytes: jest.fn().mockResolvedValue('sdsd'),
}))

jest.mock('react-native-jolocom', () => ({
  FlowType: {
    Authentication: 'Authentication',
    CredentialShare: 'CredentialShare',
    CredentialOffer: 'CredentialOffer',
    Authorization: 'Authorization',
  },
  SDKError: {
    codes: {
      ParseJWTFailed: 'ParseJWT',
    },
  },
  JolocomLib: {
    parse: {
      interactionToken: {
        fromJWT: jest.fn(),
      },
    },
  },
}))

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage)

jest.mock('react-native-localize', () => ({
  findBestAvailableLanguage: (_: Array<string>) => 'en',
}))
