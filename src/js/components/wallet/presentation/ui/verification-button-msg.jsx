import React from 'react'
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
  msgType: React.PropTypes.string,
  phoneNumber: React.PropTypes.string,
  smsCode: React.PropTypes.string,
  index: React.PropTypes.number,
  pinFocused: React.PropTypes.bool,
  setFocusedPin: React.PropTypes.func,
  changePinValue: React.PropTypes.func,
  attrType: React.PropTypes.string
}

export default Radium(VerificationButtonMsg)
