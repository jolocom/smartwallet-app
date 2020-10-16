import React from 'react'
import * as redux from 'react-redux'
import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock'
import { getGenericPassword } from 'react-native-keychain'

import Lock from '~/screens/Modals/Lock'
import { fireEvent, waitFor } from '@testing-library/react-native'

import { strings } from '~/translations/strings'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { Colors } from '~/utils/colors'

const mockedGoBack = jest.fn()

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage)
jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn(() =>
    Promise.resolve({
      password: 5555,
    }),
  ),
}))
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}))
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useIsFocused: jest.fn(() => true),
  useNavigation: () => ({
    goBack: mockedGoBack,
  }),
}))

describe('Lock screen', () => {
  test('displays body and unlocks the app', async () => {
    const { getByTestId, getAllByTestId, getByText } = renderWithSafeArea(
      <Lock />,
    )

    await waitFor(() => getByText(strings.ENTER_YOUR_PIN))

    expect(getGenericPassword).toHaveBeenCalledTimes(1)

    const passcodeInput = getByTestId('passcode-digit-input')
    const passcodeCells = getAllByTestId('passcode-cell')
    fireEvent.changeText(passcodeInput, '1234')
    // wrong pin code
    passcodeCells.map((cell) => {
      expect(cell.parent?.parent?.props.style[2].borderColor).toBe(Colors.error)
    })

    fireEvent(passcodeInput, 'focus')
    fireEvent.changeText(passcodeInput, '5555')
    expect(mockedGoBack).toHaveBeenCalledTimes(1)
  })
})
