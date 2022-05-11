import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'
import BlockExpanded from '~/components/BlockExpanded'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'

describe('BlockExpanded', () => {
  const defaultProps = {
    title: 'Test title',
    expandedText: 'Test expanded text',
  }

  it('should match the initial snapshot', () => {
    const { toJSON, getByTestId } = renderWithSafeArea(
      <BlockExpanded {...defaultProps} />,
    ) // eslint-disable-line
    expect(toJSON()).toMatchSnapshot()
    expect(getByTestId('title').props.children).toBe(defaultProps.title)
  })

  it('should render props correctly', async () => {
    const mockFn = jest.fn()

    const { findByTestId, toJSON } = render(
      <BlockExpanded {...defaultProps} onExpand={mockFn} />,
    )

    const component = await findByTestId('blockExpandedButton')
    fireEvent(component, 'onPress')
    expect(toJSON()).toMatchSnapshot()
    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})
