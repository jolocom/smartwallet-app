import React from 'react'
import Radium from 'radium'

import { List } from 'material-ui'
import { StaticListItem, VerificationButtons } from './'

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

const ContactList = ({
  fields,
  onConfirm,
  labelText,
  attrType,
  icon,
  setFocusedPin,
  changePinValue,
  iconMsg
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
  }, index) => (<div key={address || number}>
    <StaticListItem
      key={address || number}
      verified={verified}
      textValue={address || number}
      textLabel={labelText}
      icon={index === 0 ? icon : null}
      onVerify={() => onConfirm({
        rightButtonText: 'REQUEST VERIFICATION',
        leftButtonText: 'CANCEL',
        message: iconMsg,
        style: STYLES.dialog,
        attrType: attrType,
        attrValue: address || number
      })}
      secondaryTextValue={type} />
    <VerificationButtons
      attrType={attrType}
      smsCode={smsCode}
      setFocusedPin={(value) => { setFocusedPin(value, index) }}
      changePinValue={(value) => { changePinValue(value, index) }}
      focused={pinFocused}
      value={number || address}
      codeIsSent={codeIsSent}
      verified={verified}
      enterCode={onConfirm}
      missingCodeCallBack={onConfirm}
      verify={onConfirm} />
  </div>))
}
</List>)

ContactList.propTypes = {
  iconMsg: React.PropTypes.node,
  buttonMsg: React.PropTypes.node,
  icon: React.PropTypes.any,
  attrType: React.PropTypes.string.isRequired,
  labelText: React.PropTypes.string.isRequired,
  fields: React.PropTypes.array.isRequired,
  onVerify: React.PropTypes.func.isRequired,
  changePinValue: React.PropTypes.func,
  setFocusedPin: React.PropTypes.func,
  onConfirm: React.PropTypes.func.isRequired
}

export default Radium(ContactList)
