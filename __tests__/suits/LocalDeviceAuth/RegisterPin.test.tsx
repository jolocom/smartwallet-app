import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import { setGenericPassword, STORAGE_TYPE } from 'react-native-keychain'

import RegisterPin from '~/screens/Modals/DeviceAuthentication/RegisterPin'
import { strings } from '~/translations/strings'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { PIN_USERNAME, PIN_SERVICE } from '~/utils/keychainConsts'

jest.mock('../../../src/hooks/navigation', () => ({
  useRedirectToLoggedIn: () => jest.fn(),
  useRedirectTo: jest.fn(),
}))
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}))
jest.useFakeTimers()
jest.mock('react-native-keychain', () => {
  return {
    STORAGE_TYPE: {
      AES: 'aes',
    },
    setGenericPassword: jest.fn(() => Promise.resolve(true)),
  }
})
// this is a fix for RTL, because React Native display name for Touchable opacity is not set
jest.mock(
  'react-native/Libraries/Components/Touchable/TouchableOpacity.js',
  () => {
    const { TouchableHighlight } = require('react-native')
    const MockTouchable = (props: Record<string, any>) => {
      return <TouchableHighlight {...props} />
    }
    MockTouchable.displayName = 'TouchableOpacity'

    return MockTouchable
  },
)

test('It displays Create or Verify PIN screen correctly', () => {
  const { getByText, getByTestId, getAllByTestId } = renderWithSafeArea(
    <RegisterPin />,
  )

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

  expect(getByText(strings.VERIFY_PASSCODE)).toBeDefined()
  expect(passcodeCells[0].props.children).toBe('')
  fireEvent.changeText(input, '1')
  fireEvent.changeText(input, '1')
  fireEvent.changeText(input, '1')
  fireEvent.changeText(input, '1')

  expect(strings.PINS_DONT_MATCH).toBeDefined()
})

test('it saves PIN to the Keychain', async () => {
  const { getByText, getByTestId } = renderWithSafeArea(<RegisterPin />)
  const input = getByTestId('passcode-digit-input')
  fireEvent.changeText(input, '1234')

  expect(getByText(strings.VERIFY_PASSCODE)).toBeDefined()
  fireEvent.changeText(input, '1234')

  expect(setGenericPassword).toHaveBeenCalledTimes(1)
  expect(setGenericPassword).toHaveBeenCalledWith(PIN_USERNAME, '1234', {
    service: PIN_SERVICE,
    storage: STORAGE_TYPE.AES,
  })
})

test('it resets setting up PIN flow', async () => {
  const { getByText, getByTestId } = renderWithSafeArea(<RegisterPin />)
  const input = getByTestId('passcode-digit-input')
  fireEvent.changeText(input, '1234')
  expect(getByText(strings.VERIFY_PASSCODE)).toBeDefined()

  fireEvent.changeText(input, '12')

  const resetBtn = getByTestId('button')
  fireEvent.press(resetBtn)

  expect(getByText(strings.CREATE_PASSCODE)).toBeDefined()
})
