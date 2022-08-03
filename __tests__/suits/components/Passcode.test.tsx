import React from 'react'
import { render, waitFor, cleanup } from '@testing-library/react-native'
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

  test('Passcode input displays asterics and submits correct value', async () => {
    mockSubmit.mockResolvedValue(true)

    const { getByTestId, getAllByText } = render(
      <Passcode onSubmit={mockSubmit}>
        <Passcode.Input />
        <Passcode.Keyboard />
      </Passcode>,
    )

    inputPasscode(getByTestId, [1])
    expect(getAllByText('*').length).toBe(1)

    inputPasscode(getByTestId, [1])
    expect(getAllByText('*').length).toBe(2)

    inputPasscode(getByTestId, [1])
    expect(getAllByText('*').length).toBe(3)

    inputPasscode(getByTestId, [1])
    expect(getAllByText('*').length).toBe(4)

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(1)
      expect(mockSubmit).toHaveBeenCalledWith('1111', expect.anything())
    })
  })

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
