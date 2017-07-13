import React from 'react'
import Radium from 'radium'

import { ListItem, FlatButton } from 'material-ui'

import { VerificationButtonMsg } from './'

const STYLES = {
  dialog: {
  },
  requestBtn: {
    marginLeft: '-16px'
  },
  simpleDialog: {
    contentStyle: {
    },
    actionsContainerStyle: {
      textAlign: 'center'
    }
  }
}

const VerificationButtons = ({
    buttonMsg,
    value,
    codeIsSent = false,
    verified,
    requestVerificationCode,
    resendVerificationCode,
    enterVerificationCode,
    setFocusedPin,
    index,
    attrType,
    smsCode,
    pinFocused,
    changePinValue
  }) => {
  if (verified) { return null }
  if (attrType === 'email') {
    return (<ListItem disabled leftIcon={<div />} >
      <FlatButton
        label="REQUEST VERIFICATION"
        secondary
        style={STYLES.requestBtn}
        onClick={() => requestVerificationCode({
          message: (<VerificationButtonMsg
            msgType="codeRequest"
            value={smsCode}
            phoneNumber={value}
            setFocusedPin={(value) => { setFocusedPin(value, index) }}
            changePinValue={(value) => { changePinValue(value, index) }}
            focused={pinFocused} />),
          rightButtonLabel: 'OK',
          leftButtonLabel: 'CANCEL',
          attrType,
          index,
          style: STYLES.simpleDialog,
          attrValue: value
        })} />
    </ListItem>)
  }
  if (codeIsSent) {
    return (<div>
      <ListItem disabled leftIcon={<div />} >
        <FlatButton
          label="FILL IN THE CODE"
          secondary
          style={STYLES.requestBtn}
          onClick={() => enterVerificationCode({
            message: (<VerificationButtonMsg
              msgType="codeInput"
              value={smsCode}
              phoneNumber={value}
              setFocusedPin={(value) => { setFocusedPin(value, index) }}
              changePinValue={(value) => { changePinValue(value, index) }}
              focused={pinFocused} />),
            rightButtonLabel: 'OK',
            leftButtonLabel: 'CANCEL',
            style: STYLES.simpleDialog,
            attrType,
            index,
            attrValue: value
          })} />
      </ListItem>
      <ListItem disabled leftIcon={<div />} >
        <FlatButton
          label="CAN'T FIND THE CODE"
          secondary
          style={STYLES.requestBtn}
          onClick={() => resendVerificationCode({
            message: (<VerificationButtonMsg
              msgType="codeRequest"
              phoneNumber={value}
              value={smsCode}
              setFocusedPin={(value) => { setFocusedPin(value, index) }}
              changePinValue={(value) => { changePinValue(value, index) }}
              focused={pinFocused} />),
            rightButtonLabel: 'OK',
            leftButtonLabel: 'CANCEL',
            style: STYLES.simpleDialog,
            index,
            attrType,
            attrValue: value
          })} />
      </ListItem>
    </div>)
  }
  return (<ListItem disabled leftIcon={<div />} >
    <FlatButton
      label="Request Verification"
      secondary
      style={STYLES.requestBtn}
      onClick={() => requestVerificationCode({
        message: (<VerificationButtonMsg
          msgType="codeRequest"
          value={smsCode}
          phoneNumber={value}
          setFocusedPin={() => {}}
          changePinValue={() => {}}
          focused={pinFocused} />),
        rightButtonLabel: 'OK',
        leftButtonLabel: 'CANCEL',
        style: STYLES.simpleDialog,
        attrType,
        index,
        attrValue: 'value'
      }, {
        message: (<VerificationButtonMsg
          msgType="pinInput"
          value={smsCode}
          phoneNumber={value}
          setFocusedPin={(value) => { setFocusedPin(value, index) }}
          changePinValue={(value) => { changePinValue(value, index) }}
          focused={pinFocused} />),
        rightButtonLabel: 'OK',
        leftButtonLabel: 'CANCEL',
        style: STYLES.simpleDialog,
        attrType,
        index,
        attrValue: value
      })} />
  </ListItem>)
}

VerificationButtons.propTypes = {
  buttonMsg: React.PropTypes.any,
  value: React.PropTypes.string,
  codeIsSent: React.PropTypes.bool,
  pinLength: React.PropTypes.number,
  verified: React.PropTypes.bool,
  setFocusedPin: React.PropTypes.func,
  changePinValue: React.PropTypes.func,
  index: React.PropTypes.number,
  smsCode: React.PropTypes.string,
  pinFocused: React.PropTypes.bool,
  attrType: React.PropTypes.string,
  requestVerificationCode: React.PropTypes.func,
  resendVerificationCode: React.PropTypes.func,
  enterVerificationCode: React.PropTypes.func
}

export default Radium(VerificationButtons)
