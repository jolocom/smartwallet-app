import React from 'react'
import Radium from 'radium'

import {theme} from 'styles'

import VerifiedShield from '../../../wallet/presentation/ui/verified-shield'
import VerificationButtons from '../../../wallet/presentation/ui/verification-buttons' // eslint-disable-line max-len

import TextField from 'material-ui/TextField'
import {ListItem} from 'material-ui/List'

import {Block} from '../../../structure'

const STYLES = {
  verifiedShield: {
    marginLeft: '0px',
    position: 'absolute',
    right: '20px',
    marginTop: '25px'
  },
  icon: {
    top: '16px',
    left: '8px'
  },
  listItem: {
    whiteSpace: 'nowrap',
    padding: '0 16px 0 54px'
  },
  verificationBlock: {
    padding: '0 0px 0 54px'
  },
  innerDivStyle: {
    padding: '0 0 0 0',
    fontSize: theme.textStyles.subheadline.fontSize,
    color: theme.textStyles.subheadline.color,
    fontWeight: theme.textStyles.subheadline.fontWeight,
    lineHeight: '24px'
  }
}

@Radium
export default class NotVerifiedItem extends React.Component {
  static propTypes = {
    icon: React.PropTypes.any,
    field: React.PropTypes.string,
    textLabel: React.PropTypes.string.isRequired,
    textValue: React.PropTypes.string.isRequired,
    requestVerificationCode: React.PropTypes.func,
    resendVerificationCode: React.PropTypes.func,
    enterVerificationCode: React.PropTypes.func,
    setFocusedPin: React.PropTypes.func,
    changePinValue: React.PropTypes.func,
    pinFocused: React.PropTypes.string,
    attributes: React.PropTypes.object
  }
  renderVerificationInfo = (field) => {
    let verified = false
    let pin = this.props.attributes.pin
    const smsCode = this.props.attributes.smsCode
    const codeIsSent = this.props.attributes.codeIsSent
    const attrTypeToKey = (attrType) => (attrType + 's')
    // let type = ''
    if (field === 'phone') {
      let index = '0'
      let attrType = 'phone'
      return (
        <div>
          <div style={STYLES.verificationBlock}>
            <ListItem
              innerDivStyle={STYLES.innerDivStyle}
              primaryText={`We sent you an authentification code via sms
                for verification.`}
              disabled />
          </div>
          <VerificationButtons
            attrType={attrType}
            index={index}
            requestVerificationCode={this.props.requestVerificationCode}
            resendVerificationCode={this.props.resendVerificationCode}
            enterVerificationCode={this.props.enterVerificationCode}
            smsCode={smsCode}
            pinValue={pin}
            setFocusedPin={(value) => { this.props.setFocusedPin(value, index) }} // eslint-disable-line max-len
            changePinValue={(value, codeType) => {
              this.props.changePinValue(attrTypeToKey(attrType), value, index, codeType) // eslint-disable-line max-len
            }}
            focused={this.props.pinFocused}
            value={this.props.textValue}
            codeIsSent={codeIsSent}
            verified={verified} />
        </div>
      )
    } else if (field === 'email') {
      let index = '0'
      let attrType = 'email'
      return (
        <div>
          <div style={STYLES.verificationBlock}>
            <ListItem
              innerDivStyle={STYLES.innerDivStyle}
              primaryText={`We sent you an email
              for verification. Please confirm.`}
              disabled />
          </div>
          <VerificationButtons
            attrType={attrType}
            index={index}
            requestVerificationCode={this.props.requestVerificationCode}
            resendVerificationCode={this.props.resendVerificationCode}
            enterVerificationCode={this.props.enterVerificationCode}
            smsCode={smsCode}
            pinValue={pin}
            setFocusedPin={(value) => { this.props.setFocusedPin(value, index) }} // eslint-disable-line max-len
            changePinValue={(value, codeType) => {
              this.props.changePinValue(attrType, value, index)
            }}
            focused={this.props.pinFocused}
            value={this.props.textValue}
            codeIsSent={codeIsSent}
            verified={verified} />
        </div>
      )
    }
  }

  render() {
    let leftIcon = <this.props.icon color={'grey'} />

    return (
      <div>
        <ListItem
          style={STYLES.listItem}
          leftIcon={<div style={STYLES.icon}>{leftIcon}</div>}
          rightIconButton={<VerifiedShield
            style={STYLES.verifiedShield}
            verified={false} />}
          disabled >
          <TextField
            floatingLabelText={`Unverified ${this.props.textLabel}`}
            floatingLabelFixed
            underlineShow={false}
            value={this.props.textValue} />
        </ListItem>
        <Block>
          {this.renderVerificationInfo(this.props.field)}
        </Block>
      </div>
    )
  }
}
