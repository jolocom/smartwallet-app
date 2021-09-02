import React from 'react'
import { waitFor } from '@testing-library/react-native'
import { setGenericPassword, STORAGE_TYPE } from 'react-native-keychain'

import RegisterPin from '~/screens/Modals/DeviceAuthentication/RegisterPin'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { PIN_USERNAME, PIN_SERVICE } from '~/utils/keychainConsts'
import { inputPasscode } from '../../utils/inputPasscode'

const mockNavigation = jest.fn()
const mockNavigationBack = jest.fn()
const mockedDispatch = jest.fn()

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  // eslint-disable-next-line
  useFocusEffect: jest.fn().mockImplementation(() => {}),
  useNavigation: () => ({
    navigation: mockNavigation,
    goBack: mockNavigationBack,
  }),
}))

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: () => mockedDispatch,
}))

jest.mock('react-native-keychain', () => ({
  STORAGE_TYPE: {
    AES: 'aes',
  },
  setGenericPassword: jest.fn(() => Promise.resolve(true)),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
}))

describe('Register Passcode', () => {
  xit('User is able to set up pin', async () => {
    const { getByText, getByTestId, queryByText } = renderWithSafeArea(
      <RegisterPin />,
    )

    expect(getByText(/CreatePasscode.createHeader/)).toBeDefined()
    expect(getByText(/CreatePasscode.createSubheader/)).toBeDefined()
    expect(getByText(/CreatePasscode.helperText/)).toBeDefined()

    inputPasscode(getByTestId, [1, 1, 1, 1])

    expect(getByText(/VerifyPasscode.verifyHeader/)).toBeDefined()
    expect(getByText(/VerifyPasscode.verifySubheader/)).toBeDefined()

    inputPasscode(getByTestId, [1, 1, 1, 2])

    await waitFor(() => {
      // expect input to clean up because pins don't match
      expect(queryByText('*')).toBe(null)
    })

    inputPasscode(getByTestId, [1, 1, 1, 1])

    expect(setGenericPassword).toHaveBeenCalledTimes(1)
    expect(setGenericPassword).toHaveBeenCalledWith(PIN_USERNAME, '1111', {
      service: PIN_SERVICE,
      storage: STORAGE_TYPE.AES,
    })
  })
})
