import React from 'react'
import Radium from 'radium'

import { SmsCodeInput } from './'

const SmsInputMsg = ({
  smsCode = '',
  phoneNumber,
  pinFocused = false,
  setFocusedPin,
  pinLength,
  type,
  changePinValue
}) => (<div>
  {
    type === 'smsCode' ? <div>
      Please enter the authentication code we just sent to the number
      {` ${phoneNumber}`}.
    </div>
    : <div>
      Please enter your pin to start the verification process
    </div>
  }
  <SmsCodeInput
    value={smsCode}
    pinLength={pinLength}
    onFocusChange={setFocusedPin}
    onChange={changePinValue}
    focused={pinFocused} />
</div>)

SmsInputMsg.propTypes = {
  smsCode: React.PropTypes.string,
  phoneNumber: React.PropTypes.string,
  type: React.PropTypes.string,
  pinLength: React.PropTypes.number,
  pinFocused: React.PropTypes.bool,
  setFocusedPin: React.PropTypes.func,
  changePinValue: React.PropTypes.func
}

export default Radium(SmsInputMsg)
