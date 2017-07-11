import React from 'react'
import { shallow } from 'enzyme'
import SmsCodeInput from './sms-code-input'

describe('(Component) SmsCodeInput', () => {
  it('should render properly the first time', () => {
    shallow(<SmsCodeInput
      value="1"
      focused
      onChange={() => {}}
      onFocusChange={() => {}} />,
      { context: { muiTheme: { } } }
    )
  })
})
