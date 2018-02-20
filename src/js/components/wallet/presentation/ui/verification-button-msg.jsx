import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'
import TextField from 'material-ui/TextField'

import { InputMsg } from './'

const VerificationButtonMsg = ({
    msgType,
    attrType,
    smsCode = '',
    enterField,
    identityNew
  }) => {
  switch (msgType) {
    case 'codeInput':
      return (
        <div>Please enter the authentication code:
        <TextField
          id={attrType}
          onChange={(e) =>
            enterField({
              attrType: attrType,
              value: e.target.value,
              field: 'smsCode'
          })}
         />
        </div>)

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
  smsCode: PropTypes.string,
  attrType: PropTypes.string,
  enterField: PropTypes.func,
  identityNew: PropTypes.object
}

export default Radium(VerificationButtonMsg)
