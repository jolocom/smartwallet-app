import React from 'react'
import ScreenHeader from '~/components/ScreenHeader'
import renderer from 'react-test-renderer'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'

describe('ScreenHeader', () => {
  const defaultProps = {
    title: 'title text',
    subtitle: 'subtitle text',
  }

  it('renders correctly', () => {
    const { toJSON } = renderer.create(<ScreenHeader />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render title correctly', () => {
    const { getByTestId } = renderWithSafeArea(
      <ScreenHeader {...defaultProps} />,
    )
    expect(getByTestId('title').props.children).toBe(defaultProps.title)
  })

  it('should render subtitle correctly', () => {
    const { getByTestId } = renderWithSafeArea(
      <ScreenHeader {...defaultProps} />,
    )
    expect(getByTestId('subtitle').props.children).toBe(defaultProps.subtitle)
  })
})
