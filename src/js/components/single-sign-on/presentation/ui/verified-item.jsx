import React from 'react'
import Radium from 'radium'

import {theme} from 'styles'
import VerifiedShield from '../../../wallet/presentation/ui/verified-shield'
import ListItem from 'material-ui/List'
import TextField from 'material-ui/TextField'

var STYLES = {
  icon: {
    color: theme.jolocom.gray1,
    top: '16px',
    left: '8px'
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
    textLabel: React.PropTypes.string.isRequired,
    textValue: React.PropTypes.string.isRequired
  }

  render() {
    const leftIcon = <this.props.icon color={'grey'} />

    return (
      <ListItem
        style={Object.assign(STYLES.listItem, STYLES.verifiedListItem)}
        leftIcon={<div style={STYLES.icon}>{leftIcon}</div>}
        rightIconButton={this.verifiedShield}
        disabled>
        <div style={STYLES.values}>
          <TextField
            floatingLabelText={this.props.verified ? 'Verified ' + this.props.textLabel : 'Unverified ' + this.props.textLabel} // eslint-disable-line max-len
            key="1"
            inputStyle={STYLES.inputName}
            floatingLabelStyle={STYLES.labelName}
            floatingLabelFixed
            underlineShow={false}
            style={STYLES.mainTextField}
            value={this.props.textValue} />
        </div>
      </ListItem>
    )
  }

  get verifiedShield() {
    return (
      <VerifiedShield
        verified={this.props.verified}
        style={STYLES.verifiedShield} />
    )
  }
}
