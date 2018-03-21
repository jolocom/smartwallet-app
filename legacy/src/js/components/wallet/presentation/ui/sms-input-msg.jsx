import React from 'react'
import PropTypes from 'prop-types';
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
  }<br />
  <SmsCodeInput
    value={smsCode}
    pinLength={pinLength}
    onFocusChange={setFocusedPin}
    onChange={changePinValue}
    focused={pinFocused} />
</div>)

SmsInputMsg.propTypes = {
  smsCode: PropTypes.string,
  phoneNumber: PropTypes.string,
  type: PropTypes.string,
  pinLength: PropTypes.number,
  pinFocused: PropTypes.bool,
  setFocusedPin: PropTypes.func,
  changePinValue: PropTypes.func
}

export default Radium(SmsInputMsg)
