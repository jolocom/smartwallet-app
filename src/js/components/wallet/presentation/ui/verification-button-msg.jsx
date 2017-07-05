import React from 'react'
import Radium from 'radium'

import { SmsInputMsg } from './'

const VerificationButtonMsg = ({
    msgType,
    smsCode,
    phoneNumber,
    index,
    pinFocused,
    setFocusedPin,
    changePinValue
  }) => {
  switch (msgType) {
    case 'codeInput':
      return <SmsInputMsg
        value={smsCode || ''}
        disabled={false}
        phoneNumber={phoneNumber}
        setFocusedPin={setFocusedPin}
        changePinValue={changePinValue}
        focused={pinFocused || false} />

    case 'codeResent':
      return <SmsInputMsg />

    case 'codeRequest':
      return (<div>
        <b>Verification Request</b> <br />
        <br />
          Our verification service uses the latest encrypting technology which
          costs.
        <span> XXX for each verification</span>
      </div>)

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
  changePinValue: React.PropTypes.func
}

export default Radium(VerificationButtonMsg)
