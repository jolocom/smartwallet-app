import React from 'react'
import { shallow } from 'enzyme'
import SmsInputMsg from './sms-input-msg'

describe('(Component) SmsInputMsg', () => {
  it('should render properly the first time', () => {
    shallow(<SmsInputMsg
      smsCode="1"
      phoneNumber="2"
      pinFocused
      changePinValue={() => {}}
      setFocusedPin={() => {}} />,
      { context: { muiTheme: { } } }
    )
  })
})
