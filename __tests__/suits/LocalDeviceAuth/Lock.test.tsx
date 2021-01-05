import React from 'react'
import * as redux from 'react-redux'

import Lock from '~/screens/Modals/Lock'
import { fireEvent, waitFor } from '@testing-library/react-native'

import { strings } from '~/translations/strings'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { setAppLocked } from '~/modules/account/actions'

const mockGetBiometry = jest.fn();
const mockNavigationBack = jest.fn();
const mockedDispatch = jest.fn();

jest.mock('../../../src/hooks/biometry', () => ({
  useBiometry: () => ({
    getBiometry: mockGetBiometry,
    getEnrolledBiometry: jest.fn(),
  }),
}))

jest.mock('../../../src/hooks/deviceAuth', () => ({
  useGetStoredAuthValues: () => ({
    keychainPin: '5555',
    isBiometrySelected: false
  })
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

