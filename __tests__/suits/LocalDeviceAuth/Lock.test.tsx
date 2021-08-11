import React from 'react'
import * as redux from 'react-redux'
import { AppState } from 'react-native'

import { waitFor } from '@testing-library/react-native'

import * as deviceAuthHooks from '~/hooks/deviceAuth'
import Lock from '~/screens/Modals/Lock'
import { setAppLocked } from '~/modules/account/actions'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { AppStatusState } from '~/modules/appState/types'
import { inputPasscode } from '../../utils/inputPasscode'
import { getMockedDispatch } from '../../mocks/libs/react-redux'

const mockGetBiometry = jest.fn()
const mockedDispatch = jest.fn()
const mockBiometryAuthenticate = jest.fn()

jest.mock('../../../src/hooks/biometry', () => ({
  useBiometry: () => ({
    getBiometry: jest.fn(),
    authenticate: mockBiometryAuthenticate,
    getEnrolledBiometry: jest.fn().mockResolvedValue({
      available: true,
      biometryType: 'TouchID',
    }),
  }),
}))

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  // eslint-disable-next-line
  useFocusEffect: jest.fn().mockImplementation(() => {}),
  useNavigation: () => ({}),
}))

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn().mockReturnValue(mockedDispatch),
}))

jest.mock(
  '../../../node_modules/react-native/Libraries/AppState/AppState',
  () => {
    const listeners: Array<(status: AppStatusState) => void> = []
    return {
      addEventListener: jest.fn((event, handler) => {
        if (event === 'change') {
          listeners.push(handler)
        }
      }),
      removeEventListener: jest.fn((event, handler) => undefined),
      emit: jest.fn((event, nextAppState: AppStatusState) => {
        listeners.forEach((l) => l(nextAppState))
      }),
    }
  },
)

describe('Without biometry', () => {
  beforeEach(() => {
    const useGetDeviceAuthParamsSpy = jest.spyOn(
      deviceAuthHooks,
      'useGetStoredAuthValues',
    )
    useGetDeviceAuthParamsSpy.mockReturnValue({
      isLoadingStorage: false,
      biometryType: undefined,
      keychainPin: '5555',
      isBiometrySelected: false,
    })
  })
  test('Lock screen renders all necessary UI details', () => {
    const { getByText, getByTestId } = renderWithSafeArea(<Lock />)

    mockGetBiometry.mockResolvedValue(undefined)

    expect(getByText(/Lock.header/)).toBeDefined()
    expect(getByText(/Lock.forgotBtn/)).toBeDefined()
    expect(getByTestId('passcode-keyboard')).toBeDefined()
  })

  test("The app is locked if pins don't match", async () => {
    const { getByText, getByTestId } = renderWithSafeArea(<Lock />)

    inputPasscode(getByTestId, [3, 3, 3, 3])

    await waitFor(() => {
      expect(getByText(/ChangePasscode.wrongCodeHeader/)).toBeDefined()
    })
  })

  test('The app is unlocked', () => {
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
    const mockDispatchFn = jest.fn()
    useDispatchSpy.mockReturnValue(mockDispatchFn)

    const { getByTestId } = renderWithSafeArea(<Lock />)

    inputPasscode(getByTestId, [5, 5, 5, 5])

    expect(mockDispatchFn).toHaveBeenCalledTimes(1)
    expect(mockDispatchFn).toHaveBeenCalledWith(setAppLocked(false))
  })
})

describe('With biometry', () => {
  beforeEach(() => {
    const useGetDeviceAuthParamsSpy = jest.spyOn(
      deviceAuthHooks,
      'useGetStoredAuthValues',
    )
    useGetDeviceAuthParamsSpy.mockReturnValue({
      isLoadingStorage: false,
      biometryType: 'TouchID',
      keychainPin: '5555',
      isBiometrySelected: true,
    })
  })

  test('unlocks the app', async () => {
    mockBiometryAuthenticate.mockResolvedValue({
      success: true,
    })

    const mockDispatchFn = getMockedDispatch()

    await waitFor(() => renderWithSafeArea(<Lock />))

    // ACT: this imitates the app going to the background
    // @ts-expect-error - because it is a custom method, and react native App State has no emit method available
    AppState.emit('change', 'background')
    // @ts-expect-error
    AppState.emit('change', 'active')

    await waitFor(() => {
      expect(mockBiometryAuthenticate).toBeCalledTimes(1)
      expect(mockDispatchFn).toHaveBeenCalledWith(setAppLocked(false))
    })
  })

  test('do not unlock the app', async () => {
    mockBiometryAuthenticate.mockResolvedValue({
      success: false,
    })

    const mockDispatchFn = getMockedDispatch()

    await waitFor(() => renderWithSafeArea(<Lock />))

    // ACT: this imitates the app going to the background
    // @ts-expect-error
    AppState.emit('change', 'background')
    // @ts-expect-error
    AppState.emit('change', 'active')

    await waitFor(() => {
      expect(mockDispatchFn).not.toHaveBeenCalledWith(setAppLocked(true))
    })
  })
})
