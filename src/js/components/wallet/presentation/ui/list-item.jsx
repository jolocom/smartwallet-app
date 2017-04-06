import React from 'react'
import Radium from 'radium'

import {
  TextField,
  ListItem
} from 'material-ui'

var STYLES = {
  icon: {
    color: '#9ba0aa',
    focuscolor: '#b3c90f'
  }
}

@Radium
export default class EditListItem extends React.Component {
  static propTypes = {
    id: React.PropTypes.string,
    icon: React.PropTypes.any,
    iconStyle: React.PropTypes.object,
    textLabel: React.PropTypes.string,
    textName: React.PropTypes.string,
    textValue: React.PropTypes.string,
    children: React.PropTypes.node,
    onSave: React.PropTypes.func,
    focused: React.PropTypes.bool,
    onFocusChange: React.PropTypes.func,
    onChange: React.PropTypes.func
  }
  render() {
    var props = this.props
    return (
      <div onFocus={() => { props.onFocusChange(props.id) }}
        onBlur={() => { props.onFocusChange('') }}>
        <props.icon style={props.iconStyle}
          color={props.focused
              ? STYLES.icon.focuscolor
              : STYLES.icon.color} />
            {props.focused
            ? <TextField autoFocus
              floatingLabelText={props.textLabel}
              name={props.textName}
              onChange={props.onChange}
              value={props.textValue} />
            : <TextField
              floatingLabelText={props.textLabel}
              name={props.textName}
              onChange={props.onChange}
              value={props.textValue} />}

      </div>
    )
  }
}
