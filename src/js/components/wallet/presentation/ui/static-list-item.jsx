import React from 'react'
import Radium from 'radium'

import Avatar from 'material-ui/Avatar'
import {theme} from 'styles'
import VerifiedShield from './verified-shield'
import {
  TextField,
  ListItem
} from 'material-ui'

var STYLES = {
  icon: {
    color: theme.jolocom.gray1,
    top: '16px'
  },
  iconAvatar: {
    backgroundColor: 'none',
    borderRadius: '0%',
    top: '16px'
  },
  inputName: theme.textStyles.contentInputFields,
  labelName: theme.textStyles.labelInputFields,
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
    marginTop: '30px'
  },
  listItem: {
    whiteSpace: 'nowrap',
    padding: '0 16px 0 54px'
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
    savedToBlockchain: React.PropTypes.bool,
    textLabel: React.PropTypes.string.isRequired,
    textValue: React.PropTypes.string.isRequired,
    onVerify: React.PropTypes.func,
    secondaryTextValue: React.PropTypes.string
  }

  render() {
    const props = this.props
    let icon
    if (typeof props.icon === 'object') {
      icon = <Avatar style={STYLES.iconAvatar}
        src={props.icon.avatar} />
    } else {
      icon = props.icon
      ? <props.icon color={STYLES.icon.color} style={STYLES.icon} /> : <div />
    }

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
            name={'number' + props.textValue} />
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
        savedToBlockchain={this.props.savedToBlockchain}
        style={STYLES.verifiedShield}
        verify={this.props.onVerify}
      />
    )
  }
}
