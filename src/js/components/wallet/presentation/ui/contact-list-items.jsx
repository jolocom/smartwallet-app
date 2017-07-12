import React from 'react'
import Radium from 'radium'

import { List } from 'material-ui'
import { StaticListItem, VerificationButtons, VerificationButtonMsg } from './'

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

const iconMsg = {
  phone: (<div>
    <b>Verification</b> <br />
    <br />
    <span>
      Your emails hasn't been verified yet. Click "Request Verification" to get
      an emails with a verification link.
    </span>
  </div>),
  email: (<div>
    <b>Verification</b> <br />
    <br />
    <span>
      Your number hasn't been verified yet. For verification we will
      send you a sms with an authentication code to this number. You will need
      enter that code here.
    </span>
  </div>)
}

const ContactList = ({
  fields,
  requestVerificationCode,
  resendVerificationCode,
  enterVerificationCode,
  onConfirm,
  labelText,
  attrType,
  icon,
  setFocusedPin,
  changePinValue
}) => (<List disabled>
{
  fields.map(({
    verified = false,
    number = '',
    address = '',
    smsCode = '',
    codeIsSent = false,
    pinFocused = false,
    type = ''
  }, index) => {
    const attrValue = address || number
    return (<div key={attrValue}>
      <StaticListItem
        key={attrValue}
        verified={verified}
        textValue={attrValue}
        textLabel={labelText}
        icon={index === 0 ? icon : null}
        onVerify={() => onConfirm({
          rightButtonLabel: 'REQUEST VERIFICATION',
          leftButtonLabel: 'CANCEL',
          message: iconMsg[attrType],
          style: STYLES.simpleDialog,
          attrValue,
          attrType,
          index
        }, {
          message: (<VerificationButtonMsg
            msgType="pinInput"
            value={smsCode}
            pinLength={4}
            phoneNumber={attrValue}
            setFocusedPin={(value) => { setFocusedPin(value, index) }}
            changePinValue={(value) => { changePinValue(value, index) }}
            focused={pinFocused} />),
          rightButtonLabel: 'OK',
          leftButtonLabel: 'CANCEL',
          attrType,
          index,
          style: STYLES.simpleDialog,
          attrValue
        })}
        secondaryTextValue={type} />
      <VerificationButtons
        attrType={attrType}
        index={index}
        requestVerificationCode={requestVerificationCode}
        resendVerificationCode={resendVerificationCode}
        enterVerificationCode={enterVerificationCode}
        smsCode={smsCode}
        setFocusedPin={(value) => { setFocusedPin(value, index) }}
        changePinValue={(value) => { changePinValue(value, index) }}
        focused={pinFocused}
        value={attrValue}
        codeIsSent={codeIsSent}
        verified={verified} />
    </div>)
  })
}
</List>)

ContactList.propTypes = {
  buttonMsg: React.PropTypes.node,
  icon: React.PropTypes.any,
  attrType: React.PropTypes.string.isRequired,
  labelText: React.PropTypes.string.isRequired,
  fields: React.PropTypes.array.isRequired,
  changePinValue: React.PropTypes.func,
  setFocusedPin: React.PropTypes.func,
  onConfirm: React.PropTypes.func.isRequired,
  requestVerificationCode: React.PropTypes.func,
  resendVerificationCode: React.PropTypes.func,
  enterVerificationCode: React.PropTypes.func.isRequired
}

export default Radium(ContactList)
