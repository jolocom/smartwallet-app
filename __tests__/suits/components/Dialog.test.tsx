import React from 'react'
import Dialog from '~/components/Dialog'
import { render, fireEvent } from '@testing-library/react-native'

describe('Dialog', () => {
  it('is controlled and should call onPress once', async () => {
    const mockFn = jest.fn()
    const { findByTestId } = render(<Dialog onPress={mockFn} />)

    const component = await findByTestId('dialog')
    fireEvent(component, 'onPress')

    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})
