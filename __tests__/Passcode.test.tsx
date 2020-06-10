import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'

import Passcode from '~/screens/DeviceAuthentication/Passcode'
import { strings } from '~/translations/strings'

jest.mock('../src/hooks/useRedirectTo')
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}))
jest.useFakeTimers()

test('It displays Create or Verify PIN screen correctly', async () => {
  const { getByText, getByTestId, getAllByTestId } = render(<Passcode />)

  expect(getByText(strings.CREATE_PASSCODE)).toBeDefined()

  const input = getByTestId('passcode-digit-input')
  fireEvent.changeText(input, '1')

  const passcodeCells = getAllByTestId('passcode-cell')
  expect(passcodeCells[0].props.children).toBe('*')
  expect(passcodeCells[1].props.children).toBe('')

  //act
  fireEvent.changeText(input, '23')

  //assess
  expect(passcodeCells[0].props.children).toBe('*')
  expect(passcodeCells[1].props.children).toBe('*')
  expect(passcodeCells[2].props.children).toBe('*')
  expect(passcodeCells[3].props.children).toBe('')

  fireEvent.changeText(input, '4')

  const spinner = getByTestId('loading-indicator')
  expect(spinner).toBeDefined()

  setTimeout(() => {
    expect(getByText(strings.VERIFY_PASSCODE)).toBeDefined()
    expect(passcodeCells[0].props.children).toBe('')
    fireEvent.changeText(input, '1')
    fireEvent.changeText(input, '1')
    fireEvent.changeText(input, '1')
    fireEvent.changeText(input, '1')

    expect(strings.PINS_DONT_MATCH).toBeDefined()
  }, 3000)
})
