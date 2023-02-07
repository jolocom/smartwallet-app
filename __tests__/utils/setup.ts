import * as ReactNative from 'react-native'

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
  findBestAvailableLanguage: (_: string[]) => 'en',
}))

jest.mock('../../src/errors/errorContext.tsx', () => ({
  useErrorContext: () => ({
    error: null,
    errorScreen: null,
    setError: jest.fn(),
  }),
}))

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock')

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {}

  return Reanimated
})

jest.mock('react-native-gesture-handler', () => {
  const gestureHandlerMocks = jest.requireActual(
    '../../node_modules/react-native-gesture-handler/src/mocks.ts',
  ).default

  return {
    ...gestureHandlerMocks,
    TouchableOpacity: gestureHandlerMocks.PanGestureHandler,
    TouchableWithoutFeedback: gestureHandlerMocks.PanGestureHandler,
  }
})

jest.mock('../../src/hooks/useTranslation.ts', () => () => ({
  currentLanguage: 'en',
  t: jest
    .fn()
    .mockImplementation(
      (term, interpolationValue) =>
        term + (interpolationValue ? JSON.stringify(interpolationValue) : ''),
    ),
}))

// @ts-expect-error
global.__reanimatedWorkletInit = jest.fn()

jest.mock('@react-native-community/netinfo', () => ({
  RNCNetInfo: 'N/A',
  useNetInfo: jest.fn().mockReturnValue({
    isConnected: true,
  }),
}))

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({ children }: { children: any }) => children
  return { KeyboardAwareScrollView }
})

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

jest.mock('react-native-nfc-manager', () => ({
  __esModule: true,
  default: {
    isSupported: jest.fn().mockReturnValue(true),
    isEnabled: jest.fn().mockReturnValue(true),
    start: jest.fn().mockResolvedValue(true),
  },
}))

jest.mock('@jolocom/react-native-ausweis', () => ({
  aa2Module: {
    isInitialized: true,
    initAa2Sdk: jest.fn(),
    cancelFlow: jest.fn(),
    setHandlers: jest.fn(),
    resetHandlers: jest.fn(),
    setAccessRights: jest.fn(),
    acceptAuthRequest: jest.fn(),
    setPin: jest.fn(),
    setCan: jest.fn(),
    setPuk: jest.fn(),
    setNewPin: jest.fn(),
    startChangePin: jest.fn(),
  },
}))

ReactNative.NativeModules.RNBranch = {}

export const Platform = {
  ...ReactNative.Platform,
  OS: 'ios',
  Version: 123,
  isTesting: true,
  select: objs => objs['ios'],
}

export default Object.setPrototypeOf(
  {
    Platform,
  },
  ReactNative,
)
