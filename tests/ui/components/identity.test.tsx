import React from 'react'
import { IdentityComponent } from 'src/ui/home/components/identity'
import { shallow } from 'enzyme'

describe('Identity component', ()=> {
  const COMMON_PROPS = {
    scanning: false,
    userName: '',
    phoneNumber: '',
    emailAddress: '',
    onUserNameChange: () => null,
    onPhoneNumberChange: () => null,
    onEmailAddressChange: () => null,
    onScannerStart: () => null,
    onScannerSuccess: () => null,
    onScannerCancel: () => null
  } 
  it('matches the snapshot on render', () => {

    const rendered = shallow(<IdentityComponent {...COMMON_PROPS}/>)
    expect(rendered).toMatchSnapshot()
  })
})
