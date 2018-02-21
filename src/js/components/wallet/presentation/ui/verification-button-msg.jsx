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
        return (<div><block>
            In order to verify your Phone Number we will send you a text message with the verification code.
          </block><block>
            As soon as you get it, just click "Enter the code" button.
          </block></div>)
      } else {
        return (<div><block>
            In order to verify your E-Mail we will send you an E-Mail with a verification code.
          </block><block>
            As soon as you get it, just click "Enter the code" button.
          </block></div>)
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
