import React from 'react'
import NavigationHeader from '~/components/NavigationHeader'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'

describe('Navigation Header', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<NavigationHeader onPress={jest.fn()} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('renders BackArrowIcon correctly', () => {
    const defaultProps = {
      type: 'back',
      onPress: jest.fn(),
    }
    const { toJSON, getByTestId } = render(
      <NavigationHeader {...defaultProps} />,
    )
    expect(toJSON()).toMatchSnapshot()
    expect(getByTestId('backArrow').props.children).toBeTruthy()
  })

  it('renders CloseIcon correctly', () => {
    const defaultProps = {
      type: 'close',
      onPress: jest.fn(),
    }
    const { toJSON, getByTestId } = render(
      <NavigationHeader {...defaultProps} />,
    )
    expect(toJSON()).toMatchSnapshot()
    expect(getByTestId('closeIcon').props.children).toBeTruthy()
  })

  it('renders children correctly', () => {
    const defaultProps = {
      type: 'back',
      onPress: jest.fn(),
      children: <Text>Hello there</Text>,
    }
    const { toJSON, getByTestId } = render(
      <NavigationHeader {...defaultProps} />,
    )
    expect(toJSON()).toMatchSnapshot()
    expect(getByTestId('heading').props.children).toBe(defaultProps.children)
  })
})
