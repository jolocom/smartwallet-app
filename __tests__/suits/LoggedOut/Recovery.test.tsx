import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import Recovery from '~/screens/Modals/Recovery'
import { strings } from '~/translations/strings'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'

jest.useFakeTimers()

const validSeedKeys = [
  'tree',
  'ready',
  'real',
  'reason',
  'rebel',
  'track',
  'trade',
  'traffic',
  'tragic',
  'ceiling',
  'celery',
]

describe('User on a Recovery screen', () => {
  test('sees screen with initial state', () => {
    const { getByText, getByTestId, getAllByTestId } = renderWithSafeArea(
      <Recovery />,
    )
    expect(getByText(strings.RECOVERY)).toBeDefined()
    expect(getByText(strings.START_ENTERING_SEED_PHRASE)).toBeDefined()
    expect(getByTestId('seedphrase-input')).toBeDefined()
    expect(getByText(strings.WHAT_IF_I_FORGOT)).toBeDefined()
    expect(getByText(strings.CONFIRM)).toBeDefined()
    expect(getByText(strings.BACK)).toBeDefined()
  })

  test('can add a seed key to a phrase', async () => {
    const { getByText, getByTestId, getAllByTestId } = renderWithSafeArea(
      <Recovery />,
    )
    const input = getByTestId('seedphrase-input')

    fireEvent(input, 'focus')
    // test if suggestions are displayed when keyboard is up
    const suggestions = getByTestId('suggestions-list')
    expect(suggestions).toBeDefined()

    fireEvent.changeText(input, 'you')

    expect(input.props.value).toBe('you')
    expect(getAllByTestId('suggestion-pill')).toHaveLength(3) // that many values will be returned by bip39

    // resetting the input
    fireEvent.changeText(input, '')
    expect(suggestions.props.data).toHaveLength(0)
    expect(input.props.value).toBe('')

    fireEvent(input, 'submitEditing', { nativeEvent: { text: 'you' } })
    expect(getByText('1/12')).toBeDefined()

    // when trying to submit something that doesn't match anything form bip39
    fireEvent(input, 'submitEditing', { nativeEvent: { text: 'treee' } })
    expect(getByText('1/12')).toBeDefined()

    validSeedKeys.forEach((key) => {
      fireEvent.changeText(input, key)
      fireEvent(input, 'submitEditing', { nativeEvent: { text: key } })
    })
    expect(getByText('12/12')).toBeDefined()
  })
})
