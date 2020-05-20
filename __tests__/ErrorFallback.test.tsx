import React from 'react'
import { ErrorFallback } from '~/components/ErrorFallback'
import { render } from '@testing-library/react-native'

describe('ErrorFallback', () => {
  const defaultProps = {
    title: 'Test title',
    description: 'Test description',
  }

  it('should match the initial snapshot', () => {
    const { baseElement } = render(<ErrorFallback {...defaultProps} />)

    expect(baseElement).toMatchSnapshot()
  })

  it('should correctly render the props', () => {
    const { getByTestId } = render(<ErrorFallback {...defaultProps} />)

    expect(getByTestId('paragraph').props.children).toBe(
      defaultProps.description,
    )
    expect(getByTestId('header').props.children).toBe(defaultProps.title)
  })
})
