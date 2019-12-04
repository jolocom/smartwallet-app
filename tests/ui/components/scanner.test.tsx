import React from 'react'
import { shallow } from 'enzyme'
import { ScannerComponent } from '../../../src/ui/interaction/component/scanner'
import { Animated, TouchableHighlight } from 'react-native'
import { stub } from '../../utils'
import QRCodeScanner, { Event } from 'react-native-qrcode-scanner'

describe('Scanner component', () => {
  const defaultProps = {
    onScan: jest.fn(),
    isTorchPressed: false,
    onPressTorch: jest.fn(),
    reRenderKey: 4,
    isError: false,
    colorAnimationValue: new Animated.Value(0),
    textAnimationValue: new Animated.Value(0),
  }

  it('matches the snapshot on initial render', () => {
    const component = shallow(<ScannerComponent {...defaultProps} />)
    expect(component).toMatchSnapshot()
  })

  it('correctly changes torch button while icon is touched', () => {
    const props = { ...defaultProps, isTorchPressed: true }
    const component = shallow(<ScannerComponent {...props} />)
    expect(component).toMatchSnapshot()
  })

  it('renders the local error', () => {
    const props = { ...defaultProps, isError: true }
    const component = shallow(<ScannerComponent {...props} />)
    expect(component).toMatchSnapshot()
  })

  it('cals onPressTorch when the torch button is pressed', () => {
    const component = shallow(<ScannerComponent {...defaultProps} />)
    component.find(TouchableHighlight).simulate('pressIn')
    expect(defaultProps.onPressTorch).toBeCalledTimes(1)
  })

  it('should correctly render the QRScanner and call onRead', () => {
    const mockEvent = stub<Event>({ data: 'test-jwt' })
    const component = shallow(<ScannerComponent {...defaultProps} />)

    component
      .find(QRCodeScanner)
      .props()
      .onRead(mockEvent)

    expect(defaultProps.onScan).toHaveBeenCalledWith('test-jwt')
  })
})
