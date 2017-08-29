import React from 'react'
import Radium from 'radium'

import { List } from 'material-ui'
import { StaticListItem, VerificationButtons } from './'

const iconMsg = {
  phone: (<div>
    <span>
      Your number hasn't been verified yet. For verification we will
      send you a sms with an authentication code to this number. You will need
      enter that code here.
    </span>
  </div>),
  email: (<div>
    <span>
      Your email hasn't been verified yet. Click "Request Verification" to get
      an email with a verification link.
    </span>
  </div>)
}

const attrTypeToKey = (attrType) => (attrType + 's')

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
  pinFocused = false,
  changePinValue
}) => (<List style={{padding: '0'}} disabled>
{
  fields.map(({
    verified = false,
    number = '',
    address = '',
    smsCode = '',
    pin = '',
    codeIsSent = false,
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
          title: 'Verification',
          style: {},
          attrValue,
          attrType,
          index
        })}
        secondaryTextValue={type} />
      <VerificationButtons
        attrType={attrType}
        index={index}
        requestVerificationCode={requestVerificationCode}
        resendVerificationCode={resendVerificationCode}
        enterVerificationCode={enterVerificationCode}
        smsCode={smsCode}
        pinValue={pin}
        setFocusedPin={(value) => { setFocusedPin(value, index) }}
        changePinValue={(value, codeType) => {
          changePinValue(attrTypeToKey(attrType), value, index, codeType)
        }}
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
  pinFocused: React.PropTypes.bool,
  enterVerificationCode: React.PropTypes.func.isRequired
}

export default Radium(ContactList)
