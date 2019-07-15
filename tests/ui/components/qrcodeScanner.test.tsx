import React from 'react'
import { QRcodeScanner } from 'src/ui/generic/qrcodeScanner'
import { shallow } from 'enzyme'
import MockDate from 'mockdate'

describe('QRCodeScanner component', () => {
  beforeAll(() => MockDate.set(new Date(1563187115089)))
  afterAll(() => MockDate.reset())

  it('matches the snapshot with back handler', () => {
    const props: QRcodeScanner['props'] = {
      onScannerSuccess: jest.fn(),
      onScannerCancel: jest.fn(),
      loading: false,
      // @ts-ignore navigation param not needed
      navigation: null,
    }

    const rendered = shallow(<QRcodeScanner {...props} />)
    expect(rendered).toMatchSnapshot()
  })
})
