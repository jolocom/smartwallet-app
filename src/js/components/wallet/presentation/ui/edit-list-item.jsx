import React from 'react'
import Radium from 'radium'

import {
  TextField
} from 'material-ui'

import {theme} from 'styles'
var STYLES = {
  icon: {
    color: theme.jolocom.gray1,
    focuscolor: theme.palette.primary1Color
  },
  clear: {
    display: 'inline-block',
    marginTop: '20px',
    position: 'absolute',
    height: '48px',
    width: '48px',
    cursor: 'pointer'
  },
  img: {
    userSelect: 'none',
    marginTop: '14px',
    marginLeft: '8px',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    width: '24px',
    height: '24px'
  },
  disabled: {
    color: theme.palette.textColor
  },
  disabledUnderline: {
    borderBottom: 'solid',
    borderWidth: 'medium medium 1px'
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
    errorText: React.PropTypes.string,
    verified: React.PropTypes.bool.isRequired,
    children: React.PropTypes.node,
    focused: React.PropTypes.bool.isRequired,
    onFocusChange: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired
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
            {props.verified
            ? <TextField
              disabled
              inputStyle={STYLES.disabled}
              underlineDisabledStyle={STYLES.disabledUnderline}
              floatingLabelText={'Verified ' + props.textLabel}
              name={props.textName}
              value={props.textValue} />
            : props.focused
            ? <TextField autoFocus
              floatingLabelText={props.textLabel}
              name={props.textName}
              onChange={props.onChange}
              value={props.textValue}
              errorText={this.props.errorText} />
            : <TextField
              floatingLabelText={props.textLabel}
              name={props.textName}
              onChange={props.onChange}
              value={props.textValue}
              errorText={this.props.errorText} />
            }
        <div style={{...STYLES.clear}}>
          <div onClick={() => this.props.onDelete()}
            style={{...STYLES.img, ...{
              backgroundImage: 'url(/img/ic_cancel_brown_24px.svg)'
            }}} />
        </div>
      </div>
    )
  }
}
