import React from 'react'
import { QRcodeScanner } from 'src/ui/generic/qrcodeScanner'
import { shallow } from 'enzyme'
import mockCamera from '../../__mocks__/react-native-camera'

describe("QRcodeScanner component", () => {
  jest.mock("react-native-camera", () => mockCamera)

  it("matches the snapshot with back handler", () => {
    const BackHandler = jest.fn()

    const props = {
      onScannerSuccess: () => null,
      onScannerCancel: () => null,
      listener: BackHandler
    }

    const rendered = shallow(<QRcodeScanner {...props} />)
    expect(rendered).toMatchSnapshot()
  })
})
