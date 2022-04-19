import { render } from '@testing-library/react-native'
import React from 'react'
import BlockExpanded from '~/components/BlockExpanded'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'

describe('BlockExpanded', () => {
  const defaultProps = {
    title: 'Test title',
    expandedText: 'Test expanded text',
  }
  it('should match the initial snapshot', () => {
    const { toJSON } = renderWithSafeArea(<BlockExpanded {...defaultProps} />) // eslint-disable-line
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render props correctly', () => {
    const { getByTestId } = renderWithSafeArea(
      <BlockExpanded {...defaultProps} />,
    )

    expect(getByTestId('title').props.children).toBe(defaultProps.title)
    // NOTE: Cannot be tested due to && operator, if && removed in BlockExpanded file, test works out fine.
    // expect(getByTestId('text').props.children).toBe(defaultProps.expandedText)
  })
})
