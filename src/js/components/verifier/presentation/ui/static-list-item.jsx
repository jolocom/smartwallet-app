import React from 'react'
import Radium from 'radium'

import {theme} from 'styles'
import VerifiedShield from './verified-shield'

import TextField from 'material-ui/TextField'
import ListItem from 'material-ui/List'

var STYLES = {
  icon: {
    color: theme.jolocom.gray1,
    top: '16px'
  },
  inputName: {
    color: theme.palette.textColor,
    fontSize: '1em'
  },
  labelName: {
    color: theme.palette.lighterTextColor
  },
  mainTextField: {
    padding: '0',
    flex: 1
  },
  secondaryTextField: {
    color: theme.jolocom.gray1,
    marginTop: '30px',
    '@media (max-width: 320px)': {
      marginTop: '0'
    }
  },
  verifiedListItem: {
    paddingBottom: '5px'
  },
  unverifiedListItem: {
    paddingBottom: '0px'
  },
  verifiedShield: {
    marginLeft: '0px',
    position: 'absolute',
    right: '20px',
    marginTop: '40px'
  },
  listItem: {
    whiteSpace: 'nowrap',
    padding: '0 16px 0 72px'
  },
  values: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: '48px',
    '@media (max-width: 320px)': {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  }
}

@Radium
export default class StaticListItem extends React.Component {
  static propTypes = {
    icon: React.PropTypes.any,
    verified: React.PropTypes.bool,
    textLabel: React.PropTypes.string.isRequired,
    textValue: React.PropTypes.string.isRequired,
    onVerify: React.PropTypes.func,
    secondaryTextValue: React.PropTypes.string
  }

  render() {
    const props = this.props

    const icon = props.icon
      ? <props.icon color={STYLES.icon.color} style={STYLES.icon} /> : <div />

    return (
      <ListItem
        style={Object.assign(STYLES.listItem,
        props.verified ? STYLES.verifiedListItem
      : STYLES.unverifiedListItem)}
        leftIcon={icon}
        rightIconButton={props.verified !== undefined
        ? this.verifiedShield : null}
        disabled
      >
        <div style={STYLES.values}>
          <TextField
            floatingLabelText={props.verified === undefined ? props.textLabel
              : (props.verified ? 'V' : 'Unv') + 'erified ' + props.textLabel
            }
            key="1"
            inputStyle={STYLES.inputName}
            floatingLabelStyle={STYLES.labelName}
            floatingLabelFixed
            underlineShow={false}
            style={STYLES.mainTextField}
            value={props.textValue}
            name={'number' + props.textValue}
          />
          <div style={STYLES.secondaryTextField}>
          {props.secondaryTextValue}
          </div>
        </div>
      </ListItem>
    )
  }

  get verifiedShield() {
    return (
      <VerifiedShield
        verified={this.props.verified}
        style={STYLES.verifiedShield}
        verify={this.props.onVerify}
      />
    )
  }
}
