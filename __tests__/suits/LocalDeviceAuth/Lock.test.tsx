import React from 'react'
import * as redux from 'react-redux'

import { fireEvent, waitFor } from '@testing-library/react-native'

import * as deviceAuthHooks from '~/hooks/deviceAuth';
import Lock from '~/screens/Modals/Lock'
import { strings } from '~/translations/strings'
import { setAppLocked } from '~/modules/account/actions'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'

const mockGetBiometry = jest.fn();
const mockNavigationBack = jest.fn();
const mockedDispatch = jest.fn();
const mockBiometryAuthenticate = jest.fn()

jest.mock('../../../src/hooks/biometry', () => ({
  useBiometry: () => ({
    getBiometry: jest.fn(),
    authenticate: mockBiometryAuthenticate,
    getEnrolledBiometry: jest.fn().mockResolvedValue({
      available: true,
      biometryType: 'TouchID'
    }),
  }),
}))

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useFocusEffect: jest.fn().mockImplementation(() => { }),
  useNavigation: () => ({
    goBack: mockNavigationBack,
  }),
}))

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn().mockReturnValue(mockedDispatch)
}))

const getMockedDispatch = () => {
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  const mockDispatchFn = jest.fn()
  useDispatchSpy.mockReturnValue(mockDispatchFn)
  return mockDispatchFn;
}

describe('Witout biometry', () => {
  beforeEach(() => {
    const useGetDeviceAuthParamsSpy = jest.spyOn(deviceAuthHooks, 'useGetStoredAuthValues')
    useGetDeviceAuthParamsSpy.mockReturnValue({
      isLoadingStorage: false,
      biometryType: undefined,
      keychainPin: '5555',
      isBiometrySelected: false
    })


  })
  test('Lock screen renders all necessary UI details', () => {
    const { getByText, getByTestId } = renderWithSafeArea(<Lock />);

    mockGetBiometry.mockResolvedValue(undefined);

    expect(getByText(strings.ENTER_YOUR_PASSCODE)).toBeDefined();
    expect(getByTestId('passcode-digit-input')).toBeDefined();
    expect(getByText(strings.FORGOT_YOUR_PIN)).toBeDefined();
  })

  test('The app is locked if pins don\'t match', async () => {
    const { getByTestId, getByText } = renderWithSafeArea(<Lock />);

    const passcodeInput = getByTestId('passcode-digit-input');
    fireEvent.changeText(passcodeInput, 3333);

    await waitFor(() => expect(getByText(strings.WRONG_PASSCODE)).toBeDefined());
  })

  test('The app is unlocked', () => {
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
    const mockDispatchFn = jest.fn()
    useDispatchSpy.mockReturnValue(mockDispatchFn)

    const { getByTestId } = renderWithSafeArea(<Lock />);

    const passcodeInput = getByTestId('passcode-digit-input');
    fireEvent.changeText(passcodeInput, 5555);

    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    expect(mockDispatchFn).toHaveBeenCalledWith(setAppLocked(false));
    expect(mockNavigationBack).toHaveBeenCalledTimes(1);
  })
})

describe('With biometry', () => {
  beforeEach(() => {
    const useGetDeviceAuthParamsSpy = jest.spyOn(deviceAuthHooks, 'useGetStoredAuthValues')
    useGetDeviceAuthParamsSpy.mockReturnValue({
      isLoadingStorage: false,
      biometryType: 'TouchID',
      keychainPin: '5555',
      isBiometrySelected: true
    })
  })

  test('unlocks the app', async () => {

    mockBiometryAuthenticate.mockResolvedValue({
      success: true
    })

    const mockDispatchFn = getMockedDispatch()

    renderWithSafeArea(<Lock />);

    await waitFor(() => {
      expect(mockBiometryAuthenticate).toBeCalledTimes(1);
      expect(mockDispatchFn).toHaveBeenCalledTimes(1);
      expect(mockDispatchFn).toHaveBeenCalledWith(setAppLocked(false));
    })
  })

  test('do not unlock the app', async () => {
    mockBiometryAuthenticate.mockResolvedValue({
      success: false
    })

    const mockDispatchFn = getMockedDispatch()

    renderWithSafeArea(<Lock />);
    await waitFor(() => {
      expect(mockDispatchFn).toHaveBeenCalledTimes(0)
    })
  })
})



