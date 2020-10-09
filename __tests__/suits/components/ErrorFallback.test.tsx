import React from 'react'
import { ErrorFallback } from '~/components/ErrorFallback'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'

describe('ErrorFallback', () => {
  const defaultProps = {
    title: 'Test title',
    description: 'Test description',
  }

  it('should match the initial snapshot', () => {
    const { toJSON } = renderWithSafeArea(<ErrorFallback {...defaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })

  it('should correctly render the props', () => {
    const { getByTestId } = renderWithSafeArea(
      <ErrorFallback {...defaultProps} />,
    )

    expect(getByTestId('title').props.children).toBe(defaultProps.title)
    expect(getByTestId('subtitle').props.children).toBe(
      defaultProps.description,
    )
  })
})
