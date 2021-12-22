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
  findBestAvailableLanguage: (_: string[]) => 'en',
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
  useNetInfo: jest.fn(),
}))

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({ children }: { children: any }) => children
  return { KeyboardAwareScrollView }
})

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

jest.mock('react-native-nfc-manager', () => ({
  __esModule: true,
  default: {
    isSupported: jest.fn(),
    isEnabled: jest.fn(),
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
    setPin: jest.fn(),
    setCan: jest.fn(),
    setPuk: jest.fn(),
    setNewPin: jest.fn(),
  },
}))

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'android',
  select: jest.fn(),
}))

NativeModules.RNBranch = {}
