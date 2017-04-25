import React from 'react'
import Radium from 'radium'

import {theme} from 'styles'
import VerifiedShield from './verified-shield'
import {
  TextField,
  ListItem
} from 'material-ui'

var STYLES = {
  icon: {
    color: theme.jolocom.gray1,
    marginRight: '15px'
  },
  inputName: {
    color: theme.palette.textColor,
    fontSize: '1em'
  },
  labelName: {
    color: theme.palette.lighterTextColor
  },
  mainTextField: {
    width: '150px',
    padding: '0'
  },
  secondaryTextField: {
    width: '60px',
    display: 'inline-block',
    color: theme.jolocom.gray1,
    marginRight: '10px'
  },
  verifiedListItem: {
    paddingBottom: '5px'
  },
  unverifiedListItem: {
    paddingBottom: '0px'
  },
  verifiedShield: {
    marginLeft: '0px'
  },
  listItem: {
    whiteSpace: 'nowrap'
  }
}

@Radium
export default class StaticListItem extends React.Component {
  static propTypes = {
    icon: React.PropTypes.any.isRequired,
    verified: React.PropTypes.bool.isRequired,
    textLabel: React.PropTypes.string.isRequired,
    textValue: React.PropTypes.string.isRequired,
    onVerify: React.PropTypes.func,
    secondaryTextValue: React.PropTypes.string
  }

  render() {
    var props = this.props
    return (
      <ListItem style={Object.assign(STYLES.listItem,
        props.verified ? STYLES.verifiedListItem
      : STYLES.unverifiedListItem)} disabled>
        <props.icon
          style={STYLES.icon}
          color={STYLES.icon.color} />
        <TextField
          floatingLabelText={
            (props.verified ? 'V' : 'Unv') + 'erified ' + props.textLabel
          }
          key="1"
          inputStyle={STYLES.inputName}
          floatingLabelStyle={STYLES.labelName}
          floatingLabelFixed
          underlineShow={false}
          style={STYLES.mainTextField}
          value={props.textValue}
          name={'number' + props.textValue} />
        <div style={STYLES.secondaryTextField}>
        {props.secondaryTextValue}
        </div>
        <VerifiedShield verified={props.verified} style={STYLES.verifiedShield}
          verify={props.onVerify} />
      </ListItem>
    )
  }
}
