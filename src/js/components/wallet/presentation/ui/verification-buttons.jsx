import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'

import FlatButton from 'material-ui/FlatButton'
import {ListItem} from 'material-ui/List'

import { VerificationButtonMsg } from './'

const STYLES = {
  dialog: {
  },
  requestBtn: {
    marginLeft: '-30px'
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
    value,
    codeIsSent = false,
    verified,
    requestVerificationCode,
    resendVerificationCode,
    enterVerificationCode,
    attrType,
    smsCode,
    enterField,
    identity
  }) => {

  if (verified) return null
  if (codeIsSent) {
    return (<div>
      <ListItem disabled leftIcon={<div />} >
        <FlatButton
          label="FILL IN THE CODE"
          secondary
          style={STYLES.requestBtn}
          onClick={() => enterVerificationCode({
            title: `${attrType} Verification`,
            message: (<VerificationButtonMsg
              msgType={"codeInput"}
              attrType={attrType}
              value={smsCode}
              enterField={enterField}
              identityNew={identity} />),
            rightButtonLabel: 'OK',
            leftButtonLabel: 'CANCEL',
            style: STYLES.simpleDialog,
            attrType,
            attrValue: value
          })} />
      </ListItem>
      <ListItem disabled leftIcon={<div />} >
        <FlatButton
          label="CAN'T FIND THE CODE"
          secondary
          style={STYLES.requestBtn}
          onClick={() => resendVerificationCode({
            title: 'Verification Request Phone',
            message: (<VerificationButtonMsg
              attrType={attrType}
              msgType="codeRequest"
              value={smsCode} />),
            rightButtonLabel: 'RESEND CODE',
            leftButtonLabel: 'CANCEL',
            style: STYLES.simpleDialog,
            attrType,
            attrValue: value
          })} />
      </ListItem>
    </div>)
  }
  if (attrType === 'phone') {
    return (<ListItem disabled leftIcon={<div />} >
      <FlatButton
        label="Request Verification"
        secondary
        style={STYLES.requestBtn}
        onClick={() => requestVerificationCode({
          title: 'Verification Request',
          message: (<VerificationButtonMsg
            attrType={attrType}
            msgType="codeRequest"
            value={smsCode}
            phoneNumber={value}
            />),
          rightButtonLabel: 'Send verification code',
          leftButtonLabel: 'CANCEL',
          style: STYLES.simpleDialog,
          attrType,
          attrValue: value
        })} />
    </ListItem>)
  } else {
    return (<ListItem disabled leftIcon={<div />} >
      <FlatButton
        label="Request Verification"
        secondary
        style={STYLES.requestBtn}
        onClick={() => requestVerificationCode({
          title: 'Verification Request',
          message: (<VerificationButtonMsg
            msgType="codeRequest"
            attrType={attrType}
            value={smsCode}
            phoneNumber={value}
          />),
          rightButtonLabel: 'Send verification Link',
          leftButtonLabel: 'CANCEL',
          style: STYLES.simpleDialog,
          attrType,
          attrValue: value
        })} />
    </ListItem>)
  }
}

VerificationButtons.propTypes = {
  value: PropTypes.string,
  codeIsSent: PropTypes.bool,
  verified: PropTypes.bool,
  smsCode: PropTypes.string,
  attrType: PropTypes.string,
  enterField: PropTypes.func,
  requestVerificationCode: PropTypes.func,
  resendVerificationCode: PropTypes.func,
  enterVerificationCode: PropTypes.func
}

export default Radium(VerificationButtons)
