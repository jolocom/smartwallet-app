import React from 'react'
import {
  render,
  fireEvent,
  queryAllByTestId,
} from '@testing-library/react-native'

import Recovery from '~/screens/LoggedOut/Recovery'
import { strings } from '~/translations/strings'

const mockDispatch = jest.fn()
const mockNavigation = jest.fn()

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}))
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}))

describe('User on a Recovery screen', () => {
  const { getByText, getByTestId, getAllByTestId } = render(<Recovery />)

  test('sees screen with initial state', () => {
    expect(getByText(strings.RECOVERY)).toBeDefined()
    expect(getByText(strings.START_ENTERING_SEED_PHRASE)).toBeDefined()
    expect(getByTestId('seedphrase-input')).toBeDefined()
    expect(getByText(strings.WHAT_IF_I_FORGOT)).toBeDefined()
    expect(getByText(strings.CONFIRM)).toBeDefined()
    expect(getByText(strings.BACK_TO_WALKTHROUGH)).toBeDefined()
  })

  test('can add a seed key to a phrase', async () => {
    const input = getByTestId('seedphrase-input')
    fireEvent.focus(input)

    // test if suggestions are displayed when keyboard is up
    const suggestions = getByTestId('suggestions-list')
    expect(suggestions).toBeDefined()

    fireEvent.changeText(input, 'you')

    expect(input.props.value).toBe('you')
    expect(getAllByTestId('suggestion-pill')).toHaveLength(3)

    // resetting the input
    fireEvent.changeText(input, '')
    expect(suggestions.props.data).toHaveLength(0)

    fireEvent.submitEditing(input, { nativeEvent: { text: 'you' } })
    expect(getByText('1/12')).toBeDefined()
  })
})
