import { waitFor } from '@testing-library/react-native'
import React from 'react'
import { SecureStorage } from 'react-native-jolocom'
import ChangePin from '~/screens/LoggedIn/Settings/ChangePin'
import { strings } from '~/translations'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { inputPasscode } from '../../utils/inputPasscode'
import { SecureStorageKeys } from '~/hooks/secureStorage'

const mockNavigation = jest.fn()
const mockNavigationBack = jest.fn()

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useFocusEffect: jest.fn().mockImplementation(() => {}),
  useNavigation: () => ({
    navigation: mockNavigation,
    goBack: mockNavigationBack,
  }),
}))

jest.mock('react-native-jolocom', () => ({
  SecureStorage: {
    storeValue: jest.fn(),
    getValue: jest.fn().mockResolvedValue(null),
    removeValue: jest.fn(),
  },
}))

jest.mock('../../../src/hooks/sdk', () => ({
  StorageKeys: {
    biometry: 'biometry',
  },
  useAgent: () => ({
    storage: {
      get: {
        setting: jest.fn().mockResolvedValue(true),
      },
      store: {
        setting: jest.fn().mockResolvedValue(true),
      },
    },
  }),
}))

jest.mock('../../../src/hooks/loader', () => ({
  useLoader: jest
    .fn()
    .mockImplementation(
      () =>
        async (cb: () => Promise<void>, _: object, onSuccess: () => void) => {
          await cb()
          onSuccess()
        },
    ),
}))

jest.mock('../../../src/hooks/navigation', () => ({
  useGoBack: jest.fn().mockReturnValue(true),
  useRedirectTo: jest.fn,
}))

xdescribe('Change passcode', () => {
  it('should successfully change the passcode', async () => {
    const setEncryptedPasswordSpy = jest.spyOn(SecureStorage, 'storeValue')

    const { getByText, getByTestId } = await waitFor(() =>
      renderWithSafeArea(<ChangePin />),
    )

    expect(getByText(strings.CURRENT_PASSCODE)).toBeDefined()

    inputPasscode(getByTestId, [5, 5, 5, 5])

    await waitFor(() => {
      expect(getByText(strings.CREATE_NEW_PASSCODE)).toBeDefined()
    })

    inputPasscode(getByTestId, [3, 3, 3, 3])

    await waitFor(() => {
      expect(getByText(strings.VERIFY_PASSCODE)).toBeDefined()
    })

    inputPasscode(getByTestId, [3, 3, 3, 3])

    await waitFor(() => {
      expect(setEncryptedPasswordSpy).toHaveBeenCalledTimes(1)
      expect(setEncryptedPasswordSpy).toHaveBeenCalledWith(
        SecureStorageKeys.passcode,
        '3333',
      )
    })
  })

  it('should fail when verifying the current passcode', async () => {
    const { getByText, getByTestId } = await waitFor(() =>
      renderWithSafeArea(<ChangePin />),
    )

    inputPasscode(getByTestId, [0, 0, 0, 0])

    await waitFor(() => {
      expect(getByText(strings.WRONG_PASSCODE)).toBeDefined()
    })
  })

  it('should fail when confirming (repeating) the new passcode', async () => {
    const { getByText, getByTestId } = await waitFor(() =>
      renderWithSafeArea(<ChangePin />),
    )
    expect(getByText(strings.CURRENT_PASSCODE)).toBeDefined()

    inputPasscode(getByTestId, [5, 5, 5, 5])

    await waitFor(() => {
      expect(getByText(strings.CREATE_NEW_PASSCODE)).toBeDefined()
    })

    inputPasscode(getByTestId, [3, 3, 3, 3])

    await waitFor(() => {
      expect(getByText(strings.VERIFY_PASSCODE)).toBeDefined()
    })

    inputPasscode(getByTestId, [0, 0, 0, 0])

    await waitFor(() => {
      expect(getByText(strings.WRONG_PASSCODE)).toBeDefined()
    })
  })
})
