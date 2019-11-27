import React from 'react'
import { shallow } from 'enzyme'
import { GradientButton } from '../../../src/ui/structure/gradientButton'
import { TouchableOpacity } from 'react-native'

describe('GradientButton Component', () => {
  const defaultProps = {
    onPress: jest.fn(),
    text: 'Test',
  }

  it('matches snapshot on initial render', () => {
    const component = shallow(<GradientButton {...defaultProps} />)
    expect(component).toMatchSnapshot()
  })

  it('calls onPress when pressed', () => {
    const component = shallow(<GradientButton {...defaultProps} />)
    component.find(TouchableOpacity).simulate('press')
    expect(defaultProps.onPress).toBeCalledTimes(1)
  })

  it('renders the button with custom styles', () => {
    const props = {
      ...defaultProps,
      containerStyle: { marginHorizontal: 40, height: 30 },
    }
    const component = shallow(<GradientButton {...props} />)
    expect(component).toMatchSnapshot()
  })
})
