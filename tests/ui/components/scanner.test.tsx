import React from 'react'
import { shallow } from 'enzyme'
import { ScannerComponent } from '../../../src/ui/interaction/component/scanner'
import { TouchableHighlight } from 'react-native'
import QRScanner, { Event } from 'react-native-qrcode-scanner'
import { stub } from '../../utils'

describe('QR Code component', () => {
  const props = {
    onScannerSuccess: jest.fn(),
    isCameraAllowed: true,
  }

  //@ts-ignore
  const QRComponent = shallow(<ScannerComponent {...props} />)

  it('matches the snapshot on initial render', () => {
    expect(QRComponent).toMatchSnapshot()
  })

  it('correctly changes torch button while icon is touched', () => {
    // @ts-ignore
    QRComponent.find(TouchableHighlight)
      .props()
      .onPressIn()
    QRComponent.update()
    expect(QRComponent).toMatchSnapshot()
  })

  it('correctly changes torch button when icon is released', () => {
    // @ts-ignore
    QRComponent.find(TouchableHighlight)
      .props()
      .onPressOut()

    QRComponent.update()
    expect(QRComponent).toMatchSnapshot()
  })

  it('should correctly render the QRScanner and call onRead', () => {
    const mockEvent = stub<Event>({ data: 'test-jwt' })

    QRComponent.setState({ isCameraReady: true })
    QRComponent.find(QRScanner)
      .props()
      .onRead(mockEvent)

    expect(props.onScannerSuccess).toHaveBeenCalledWith('test-jwt')
  })
})
