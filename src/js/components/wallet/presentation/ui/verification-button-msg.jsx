import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'

import { InputMsg } from './'

const VerificationButtonMsg = ({
    msgType,
    attrType,
    smsCode = '',
    phoneNumber,
    index,
    pinFocused = false,
    setFocusedPin,
    changePinValue
  }) => {
  switch (msgType) {
    case 'codeInput':
      return <InputMsg
        type="smsCode"
        value={smsCode}
        disabled={false}
        pinLength={6}
        phoneNumber={phoneNumber}
        setFocusedPin={setFocusedPin}
        changePinValue={changePinValue}
        focused={pinFocused} />

    case 'pinInput':
      return <InputMsg
        type="pin"
        value={smsCode}
        disabled={false}
        pinLength={4}
        phoneNumber={phoneNumber}
        setFocusedPin={setFocusedPin}
        changePinValue={changePinValue}
        focused={pinFocused} />

    case 'codeResent':
      return <InputMsg />

    case 'codeRequest':
      if (attrType === 'phone') {
        return (<div>
            To confirm your Phone Number we will send you a verification code,
            which you'll receive via text message.
        </div>)
      } else {
        return (<div>
            To confirm your E-Mail we will send you an confirmation
            E-Mail with a link.
        </div>)
      }

    default:
      return <div></div>
  }
}

VerificationButtonMsg.propTypes = {
  msgType: PropTypes.string,
  phoneNumber: PropTypes.string,
  smsCode: PropTypes.string,
  index: PropTypes.number,
  pinFocused: PropTypes.bool,
  setFocusedPin: PropTypes.func,
  changePinValue: PropTypes.func,
  attrType: PropTypes.string
}

export default Radium(VerificationButtonMsg)
