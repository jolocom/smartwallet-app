import React from 'react'
import Radium from 'radium'

import { SmsCodeInput } from './'

const SmsInputMsg = ({
  smsCode = '',
  phoneNumber,
  pinFocused = false,
  setFocusedPin,
  changePinValue
}) => (<div>
  <b>Verification Request</b> <br />
  <br />
  <div>
    Please enter the authentication code we just sent to the number
    {` ${phoneNumber}`}.
  </div>
  <SmsCodeInput
    value={smsCode}
    onFocusChange={setFocusedPin}
    onChange={changePinValue}
    focused={pinFocused} />
</div>)

SmsInputMsg.propTypes = {
  smsCode: React.PropTypes.string,
  phoneNumber: React.PropTypes.string,
  pinFocused: React.PropTypes.bool,
  setFocusedPin: React.PropTypes.func,
  changePinValue: React.PropTypes.func
}

export default Radium(SmsInputMsg)
