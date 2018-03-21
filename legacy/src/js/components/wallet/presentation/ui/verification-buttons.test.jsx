import React from 'react'
import { shallow } from 'enzyme'
import VerificationButtons from './verification-button-msg'

describe('(Component) VerificationButtons', () => {
  it('should render properly the first time', () => {
    shallow(<VerificationButtons
      buttonMsg=""
      value=""
      codeIsSent
      verified
      enterCode={() => {}}
      missingCodeCallBack={() => {}}
      verify={() => {}}
      setFocusedPin={() => {}}
      index="5"
      attrType=""
      smsCode=""
      pinFocused
      changePinValue={() => {}} />,
      { context: { muiTheme: { } } }
    )
  })
})
