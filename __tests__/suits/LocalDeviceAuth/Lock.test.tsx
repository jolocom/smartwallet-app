import React from 'react'
import * as redux from 'react-redux'
import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock'

import { Lock } from '~/modals/Lock'
import { fireEvent, waitFor } from '@testing-library/react-native'

import { strings } from '~/translations/strings'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { Colors } from '~/utils/colors'
import { getGenericPassword } from 'react-native-keychain'
import { unlockApp } from '~/modules/account/actions'

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage)
jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn(() =>
    Promise.resolve({
      password: 5555,
    }),
  ),
}))

describe('Lock screen', () => {
  test('displays body and unlocks the app', async () => {
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
    const mockDispatchFn = jest.fn()
    useDispatchSpy.mockReturnValue(mockDispatchFn)

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
    expect(mockDispatchFn).toHaveBeenCalledWith(unlockApp())
  })
})
