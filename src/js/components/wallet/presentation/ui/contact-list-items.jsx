import React from 'react'
import Radium from 'radium'

import {List, ListItem, FlatButton} from 'material-ui'
import {StaticListItem} from './'

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

const ContactList = (props) => {
  let {fields, onConfirm, labelText, attrType, icon, iconMsg, buttonMsg} = props

  const list = fields.map(({verified, number, address, type = ''}, index) =>
    (<div key={number || address}>
      <StaticListItem
        key={index || address}
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
      {
        verified ? null : (<ListItem
          disabled leftIcon={<div />}>
          <FlatButton
            label="Request Verification"
            secondary
            style={STYLES.requestBtn}
            onClick={() => onConfirm({
              message: buttonMsg,
              rightButtonText: 'OK',
              leftButtonText: 'CANCEL',
              style: STYLES.simpleDialog,
              attrValue: number || address
            })} />
        </ListItem>)
      }
    </div>))

  return (<List disabled>
    {list}
  </List>)
}

ContactList.propTypes = {
  iconMsg: React.PropTypes.node,
  buttonMsg: React.PropTypes.node,
  icon: React.PropTypes.any,
  attrType: React.PropTypes.string.isRequired,
  labelText: React.PropTypes.string.isRequired,
  fields: React.PropTypes.array.isRequired,
  onVerify: React.PropTypes.func.isRequired,
  onConfirm: React.PropTypes.func.isRequired
}

export default Radium(ContactList)
