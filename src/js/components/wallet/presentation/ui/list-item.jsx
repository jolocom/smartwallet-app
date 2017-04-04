import React from 'react'
import Radium from 'radium'

import {
  ListItem,
  TextField
} from 'material-ui'

const STYLES = {
  icon: {
    color: '#9ba0aa'
  }
}

const EditListItem = ({Icon, iconStyle, textLabel,
  textName, textValue, onChange}) => {
  return (
    <ListItem
      leftIcon={<Icon style={iconStyle} color={STYLES.icon.color} />}>
      <TextField
        floatingLabelText={textLabel}
        name={textName}
        onChange={onChange}
        value={textValue} />
    </ListItem>
  )
}

EditListItem.propTypes = {
  Icon: React.PropTypes.any,
  iconStyle: React.PropTypes.object,
  textLabel: React.PropTypes.string,
  textName: React.PropTypes.string,
  textValue: React.PropTypes.string,
  children: React.PropTypes.node,
  onSave: React.PropTypes.func,
  onChange: React.PropTypes.func
}

export default Radium(EditListItem)
