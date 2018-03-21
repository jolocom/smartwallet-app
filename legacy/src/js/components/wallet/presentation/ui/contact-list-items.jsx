import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'

import List from 'material-ui/List'
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
  buttonMsg: PropTypes.node,
  icon: PropTypes.any,
  attrType: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
  changePinValue: PropTypes.func,
  setFocusedPin: PropTypes.func,
  onConfirm: PropTypes.func.isRequired,
  requestVerificationCode: PropTypes.func,
  resendVerificationCode: PropTypes.func,
  pinFocused: PropTypes.bool,
  enterVerificationCode: PropTypes.func.isRequired
}

export default Radium(ContactList)
