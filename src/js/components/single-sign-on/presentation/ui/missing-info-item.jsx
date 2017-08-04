import React from 'react'
import Radium from 'radium'

import Avatar from 'material-ui/Avatar'
import {theme} from 'styles'
import {IconIdCard, IconPassport} from '../../../common'
import {TextField, ListItem, FloatingActionButton} from 'material-ui'

import CommunicationCall from 'material-ui/svg-icons/communication/call'
import CommunicationEmail from 'material-ui/svg-icons/communication/email'
import Location from 'material-ui/svg-icons/maps/place'
import ContentAdd from 'material-ui/svg-icons/content/add'
import PlusMenu from '../../../wallet/presentation/ui'

var STYLES = {
  icon: {
    top: '16px'
  },
  iconRight: {
    top: '16px',
    right: '12px'
  },
  inputName: theme.textStyles.contentInputFields,
  labelName: theme.textStyles.labelInputFields,
  mainTextField: {
    padding: '0',
    flex: 1
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
  },
  missingHeadline: {
    fontSize: theme.textStyles.subheadline.fontSize,
    color: theme.textStyles.subheadline.color,
    fontWeight: theme.textStyles.subheadline.fontWeight,
    lineHeight: '24px',
    padding: '0 16px 0 54px'
  },
  container: {
    marginTop: '8px'
  }
}

@Radium
export default class MissingInfoItem extends React.Component {
  static propTypes = {
    icon: React.PropTypes.any,
    verified: React.PropTypes.bool,
    savedToBlockchain: React.PropTypes.bool,
    textLabel: React.PropTypes.string.isRequired,
    textValue: React.PropTypes.string.isRequired,
    onVerify: React.PropTypes.func,
    secondaryTextValue: React.PropTypes.string
  }

  getIcon(field) {
    if (field === 'phone') {
      return CommunicationCall
    } else if (field === 'email') {
      return CommunicationEmail
    } else if (field === 'passport') {
      return <IconPassport color={'orange'} />
    } else if (field === 'address') {
      return <Location color={'orange'}/>
    } else if (field === 'idcard') {
      return <IconIdCard color={'orange'}/>
    }
  }

  render() {
    const {field} = this.props
    return (
      <div style={STYLES.container}>
        <ListItem
          rightIconButton={<FloatingActionButton
            mini
            style={STYLES.iconRight}
            secondary={true}
            onClick={() => {this.props.goToMissingInfo(field)}}>
              <ContentAdd />
          </FloatingActionButton>}
          leftIcon={<div style={STYLES.icon}>
              {this.getIcon(field)}
            </div>}
          disabled
          style={STYLES.listItem}>
          <div style={STYLES.values}>
            <TextField
              floatingLabelText={field}
              floatingLabelStyle={STYLES.labelName}
              floatingLabelFixed
              inputStyle={{color: 'orange'}}
              underlineShow={false}
              style={STYLES.mainTextField}
              value={this.props.textValue}
              name={'number' + this.props.textValue} />
          </div>
        </ListItem>
        <ListItem
          innerDivStyle={STYLES.missingHeadline}
          primaryText={`To use this service your ${field} is neccessary.
          Add it to your wallet.`}
          disabled/>
      </div>
    )
  }
}
