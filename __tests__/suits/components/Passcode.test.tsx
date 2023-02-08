import { cleanup, render, waitFor } from '@testing-library/react-native'
import React from 'react'
import Passcode from '~/components/Passcode'
import { inputPasscode } from '../../utils/inputPasscode'

const mockSubmit = jest.fn()
const mockNavigate = jest.fn()

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  // eslint-disable-next-line
  useFocusEffect: jest.fn().mockImplementation(() => {}),
  useIsFocused: jest.fn(() => true),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}))

jest.mock('../../../src/hooks/settings', () => () => ({
  get: jest.fn(),
  set: jest.fn(),
}))

describe('Passcode', () => {
  afterEach(cleanup)

  test('Passcode Header displays error', async () => {
    mockSubmit.mockRejectedValue(false)

    const { getByText, getByTestId } = render(
      <Passcode onSubmit={mockSubmit}>
        <Passcode.Header
          title="CreatePasscode.createHeader"
          errorTitle="ChangePasscode.wrongCodeHeader"
        />
        <Passcode.Input />
        <Passcode.Keyboard />
      </Passcode>,
    )

    expect(getByText(/CreatePasscode.createHeader/)).toBeDefined()

    inputPasscode(getByTestId, [1, 1, 1, 1])

    await waitFor(() => {
      expect(getByText(/ChangePasscode.wrongCodeHeader/)).toBeDefined()
    })
  })
})
