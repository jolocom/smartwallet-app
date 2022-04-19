import React from 'react'
import ScreenHeader from '~/components/ScreenHeader'
import renderer from 'react-test-renderer'
import { render } from '@testing-library/react-native'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import JoloText from '../../../src/components/JoloText'
import { View } from 'react-native'
// import { render } from '@testing-library/react-native'

describe('ScreenHeader', () => {
  const defaultProps = {
    title: 'title text',
    subtitle: 'subtitle text',
  }

  it('renders correctly', () => {
    const { toJSON } = renderer.create(<ScreenHeader />)
    expect(toJSON).toMatchSnapshot()
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
