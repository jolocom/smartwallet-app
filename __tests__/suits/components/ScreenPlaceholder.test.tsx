import React from 'react'
import ScreenPlaceholder from '~/components/ScreenPlaceholder'
import { render } from '@testing-library/react-native'

describe('ScreenPlaceholder', () => {
  const defaultProps = {
    title: 'test title',
    description: 'test description',
  }

  it('should match snapshot', () => {
    const rendered = render(<ScreenPlaceholder {...defaultProps} />).toJSON()

    expect(rendered).toMatchSnapshot()
  })

  it('should render the title', () => {
    const rendered = render(<ScreenPlaceholder {...defaultProps} />)

    const title = rendered.getByTestId('title')
    expect(title.props.children).toBe(defaultProps.title)
  })

  it('should render the description', () => {
    const rendered = render(<ScreenPlaceholder {...defaultProps} />)

    const description = rendered.getByTestId('description')
    expect(description.props.children).toBe(defaultProps.description)
  })

  it('description should be of color Colors.white50', () => {
    const rendered = render(<ScreenPlaceholder {...defaultProps} />)

    const description = rendered.getByTestId('description')
    expect(description.props.style).toMatchObject([
      { textAlign: 'center', paddingTop: undefined },
      {
        fontSize: 16,
        lineHeight: 18,
        letterSpacing: 0,
        color: 'rgba(255, 255, 255, 0.50)',
        fontFamily: 'TTCommons-Regular',
      },
      { marginTop: 12, paddingHorizontal: 32 },
    ])
  })
})
