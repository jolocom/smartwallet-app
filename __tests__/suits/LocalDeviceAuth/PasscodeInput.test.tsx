import React from 'react'
import { render } from '@testing-library/react-native'

import PasscodeInput from '~/components/PasscodeInput'

const props = {
  value: '123',
  stateUpdatedFn: jest.fn(),
  onSubmit: jest.fn,
}

test('Input should have asterics as values', () => {
  const { getAllByTestId } = render(
    <PasscodeInput {...props} hasError={false} />,
  )

  const passcodeCells = getAllByTestId('passcode-cell')
  expect(passcodeCells.length).toBe(4)
  expect(passcodeCells[0].parent.parent.props.style[0].borderColor).toBe(
    'transparent',
  )

  expect(passcodeCells[0].props.children).toBe('*')
  expect(passcodeCells[1].props.children).toBe('*')
  expect(passcodeCells[2].props.children).toBe('*')
  expect(passcodeCells[3].props.children).toBe('')
})
