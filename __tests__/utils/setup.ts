import { NativeModules } from 'react-native'

jest.mock('react-native-keychain', () => ({
  SECURITY_LEVEL_ANY: 'MOCK_SECURITY_LEVEL_ANY',
  SECURITY_LEVEL_SECURE_SOFTWARE: 'MOCK_SECURITY_LEVEL_SECURE_SOFTWARE',
  SECURITY_LEVEL_SECURE_HARDWARE: 'MOCK_SECURITY_LEVEL_SECURE_HARDWARE',
}))

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
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

jest.mock('react-native-localize', () => ({
  findBestAvailableLanguage: (_: Array<string>) => 'en',
}))

jest.mock('../../src/errors/errorContext.tsx', () => ({
  useErrorContext: () => ({
    error: null,
    errorScreen: null,
    setError: jest.fn(),
  }),
}))

jest.mock('react-native/Libraries/LayoutAnimation/LayoutAnimation', () => ({
  ...require.requireActual(
    'react-native/Libraries/LayoutAnimation/LayoutAnimation',
  ),
  configureNext: jest.fn(),
}))

jest.mock(
  'react-native-reanimated',
  () =>
    jest.requireActual('../../node_modules/react-native-reanimated/mock')
      .default,
)

jest.mock('react-native-gesture-handler', () => {
  const gestureHandlerMocks = jest.requireActual(
    '../../node_modules/react-native-gesture-handler/__mocks__/RNGestureHandlerModule.js',
  ).default

  return {
    ...gestureHandlerMocks,
    TouchableOpacity: gestureHandlerMocks.PanGestureHandler,
    TouchableWithoutFeedback: gestureHandlerMocks.PanGestureHandler,
  }
})

// @ts-ignore
global.__reanimatedWorkletInit = jest.fn()

NativeModules.RNCNetInfo = {
  getCurrentState: jest.fn(() => Promise.resolve()),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
}
