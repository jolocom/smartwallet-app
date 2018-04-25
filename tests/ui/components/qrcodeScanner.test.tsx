import React from 'react'
import { QRcodeScanner } from 'src/ui/home/components/qrcodeScanner'
import { shallow } from 'enzyme'
import mockCamera from '../../__mocks__/react-native-camera'

describe('QRcodeScanner component', ()=> {
  jest.mock('react-native-camera', () => mockCamera)
  const COMMON_PROPS = {
    onScannerSuccess: () => null,
    onScannerCancel: () => null,
    listener: null
  }

  it('matches the snapshot when no input is present', () => {
    const BackHandler = jest.fn()
    const props = {
      onScannerSuccess: () => null,
      onScannerCancel: () => null,
      listener: BackHandler
    }

    const rendered = shallow(<QRcodeScanner {...props}/>)
    expect(rendered).toMatchSnapshot()
  })
})
