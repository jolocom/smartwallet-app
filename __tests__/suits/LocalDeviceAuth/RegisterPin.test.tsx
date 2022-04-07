import React from 'react'
import { waitFor } from '@testing-library/react-native'
import { SecureStorage } from 'react-native-jolocom'

import CreateWalletPin from '~/screens/Modals/WalletAuthentication/CreateWalletPin'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { inputPasscode } from '../../utils/inputPasscode'
import { SecureStorageKeys } from '~/hooks/secureStorage'

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

jest.mock('react-native-jolocom', () => ({
  SecureStorage: {
    storeValue: jest.fn(),
    getValue: jest.fn().mockResolvedValue(null),
    removeValue: jest.fn(),
  },
}))

jest.mock('@react-navigation/native', () => ({
  useIsFocused: jest.fn().mockReturnValue(true),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  createNavigatorFactory: jest.fn(),
}))

jest.mock('../../../src/hooks/settings', () => () => ({
  get: jest.fn(),
  set: jest.fn(),
}))

describe('Register Passcode', () => {
  it('User is able to set up pin', async () => {
    const setEncryptedPasswordSpy = jest.spyOn(SecureStorage, 'storeValue')
    const { getByText, getByTestId, queryByText } = renderWithSafeArea(
      <CreateWalletPin />,
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

    expect(setEncryptedPasswordSpy).toHaveBeenCalledTimes(1)
    expect(setEncryptedPasswordSpy).toHaveBeenCalledWith(
      SecureStorageKeys.passcode,
      '1111',
    )
  })
})
