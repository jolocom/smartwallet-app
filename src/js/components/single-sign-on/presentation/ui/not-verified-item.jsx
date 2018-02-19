import React from 'react'
import PropTypes from 'prop-types';
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
    field: PropTypes.string,
    requestVerificationCode: PropTypes.func,
    resendVerificationCode: PropTypes.func,
    enterVerificationCode: PropTypes.func,
    attributes: PropTypes.object,
    toggle: PropTypes.bool,
    enterField: PropTypes.func,
    identity: PropTypes.object
  }

  renderVerificationInfo = (field) => {
    const smsCode = this.props.attributes.smsCode
    const codeIsSent = this.props.attributes.codeIsSent
    const verified = this.props.attributes.verified
    let pin = this.props.attributes.pin

    if (field === 'phone') {
      let index = '0'
      let attrType = 'phone'
      return (
        <div>
          <VerificationButtons
            attrType={attrType}
            requestVerificationCode={this.props.requestVerificationCode}
            resendVerificationCode={this.props.resendVerificationCode}
            enterVerificationCode={this.props.enterVerificationCode}
            smsCode={smsCode}
            value={this.props.identity.userData[this.props.field].smsCode}
            codeIsSent={codeIsSent}
            enterField={this.props.enterField}
            identity={this.props.identity}
            verified={verified} />
        </div>
      )
    } else if (field === 'email') {
      let index = '0'
      let attrType = 'email'
      return (
        <div>
          <VerificationButtons
            attrType={attrType}
            index={index}
            requestVerificationCode={this.props.requestVerificationCode}
            resendVerificationCode={this.props.resendVerificationCode}
            enterVerificationCode={this.props.enterVerificationCode}
            smsCode={smsCode}
            value={this.props.identity.userData[this.props.field].value}
            codeIsSent={codeIsSent}
            verified={verified} />
        </div>
      )
    }
  }

  render() {

    return (
      <div>
        <Block>
          {this.renderVerificationInfo(this.props.field)}
        </Block>
      </div>
    )
  }
}
