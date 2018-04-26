import React from 'react'
import { shallow } from 'enzyme'
import { IdentityContainer } from 'src/ui/home/containers/identity'


describe('Identity container', () => {
  const COMMON_PROPS = {
    userName: '',
    phoneNumber: '',
    emailAddress: '',
    scanning: false
  }

  it('mounts correctly and matches the snapshot', () => {
    const rendered = shallow(<IdentityContainer {...COMMON_PROPS}/>)
    expect(rendered).toMatchSnapshot()
  })

  it('correctly changes scanning to true when qr code scanner is started', () => {
    const onScannerStart = jest.fn()

    const props = Object.assign({}, COMMON_PROPS {
      scanning: true
    })

    const rendered = shallow(<IdentityContainer {...props}/>)
    expect(rendered).toMatchSnapshot()
  })

  it('correctly changes scanning to false when qr code scanner is canceled', () => {
    const onScannerCancel = jest.fn()
    const props = Object.assign({}, COMMON_PROPS {
      scanning: false
    })

    const rendered = shallow(<IdentityContainer {...props}/>)
    expect(rendered).toMatchSnapshot()
  })
