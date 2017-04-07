import React from 'react'
import Radium from 'radium'

import {
  TextField
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
    id: React.PropTypes.string.isRequired,
    icon: React.PropTypes.any,
    iconStyle: React.PropTypes.object,
    textLabel: React.PropTypes.string.isRequired,
    textName: React.PropTypes.string.isRequired,
    textValue: React.PropTypes.string,
    children: React.PropTypes.node,
    focused: React.PropTypes.bool.isRequired,
    onFocusChange: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired
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
