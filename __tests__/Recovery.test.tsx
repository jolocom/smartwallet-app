import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import Recovery from '~/screens/LoggedOut/Recovery'
import { strings } from '~/translations/strings'
import { renderWithSafeArea } from './utils/renderWithSafeArea'

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
  const { getByText, getByTestId, getAllByTestId } = renderWithSafeArea(
    <Recovery />,
  )

  test('sees screen with initial state', () => {
    expect(getByText(strings.RECOVERY)).toBeDefined()
    expect(getByText(strings.START_ENTERING_SEED_PHRASE)).toBeDefined()
    expect(getByTestId('seedphrase-input')).toBeDefined()
    expect(getByText(strings.WHAT_IF_I_FORGOT)).toBeDefined()
    expect(getByText(strings.CONFIRM)).toBeDefined()
    expect(getByText(strings.BACK)).toBeDefined()
  })

  test('can add a seed key to a phrase', async () => {
    const input = getByTestId('seedphrase-input')

    fireEvent.focus(input)

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

    fireEvent.submitEditing(input, { nativeEvent: { text: 'you' } })
    expect(getByText('1/12')).toBeDefined()

    // when trying to submit something that doesn't match anything form bip39
    fireEvent.submitEditing(input, { nativeEvent: { text: 'treee' } })
    expect(getByText('1/12')).toBeDefined()

    validSeedKeys.forEach((key) => {
      fireEvent.changeText(input, key)
      fireEvent.submitEditing(input, { nativeEvent: { text: key } })
    })
    expect(getByText('12/12')).toBeDefined()
  })
})
