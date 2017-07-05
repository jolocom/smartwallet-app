import React from 'react'
import { shallow } from 'enzyme'
import VerificationButtonMsg from './verification-button-msg'

describe('(Component) VerificationButtonMsg', () => {
  it('should render properly the first time', () => {
    shallow(<VerificationButtonMsg
      msgType="1"
      smsCode="2"
      phoneNumber="2"
      index={2}
      pinFocused
      setFocusedPin={() => {}}
      changePinValue={() => {}} />,
      { context: { muiTheme: { } } }
    )
  })
})
