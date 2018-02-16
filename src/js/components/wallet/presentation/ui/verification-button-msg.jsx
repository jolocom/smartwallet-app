import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'
import TextField from 'material-ui/TextField'

import { InputMsg } from './'

const VerificationButtonMsg = ({
    msgType,
    attrType,
    smsCode = '',
    setFocusedPin,
    changePinValue,
    pinFocused,
    phoneNumber,
    enterField,
    identityNew
  }) => {
  switch (msgType) {
    case 'codeInput':
      console.log(identityNew.userData['phone'].smsCode)
      return (
        <div>  <TextField
            id={attrType}
            onChange={(e) =>
              enterField({
                attrType: 'phone',
                value: e.target.value,
                field: attrType
            })}
               />
        </div>)

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
  attrType: PropTypes.string,
  pinFocused: PropTypes.bool,
  enterField: PropTypes.func,
  setFocusedPin: PropTypes.func,
  changePinValue: PropTypes.func,
  identityNew: PropTypes.object
}

export default Radium(VerificationButtonMsg)
