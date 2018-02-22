import React from 'react'
import PropTypes from 'prop-types'
import Radium from 'radium'
import VerificationButtons from '../../../wallet/presentation/ui/verification-buttons' // eslint-disable-line max-len
import {Block} from '../../../structure'

@Radium
export default class NotVerifiedItem extends React.Component {
  static propTypes = {
    field: PropTypes.string,
    requestVerificationCode: PropTypes.func,
    resendVerificationCode: PropTypes.func,
    enterVerificationCode: PropTypes.func,
    attributes: PropTypes.object,
    enterField: PropTypes.func,
    identity: PropTypes.object
  }

  renderVerificationInfo = (field) => {
    const smsCode = this.props.attributes.smsCode
    const codeIsSent = this.props.attributes.codeIsSent
    const verified = this.props.attributes.verified

    if (field === 'phone') {
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
      let attrType = 'email'
      return (
        <div>
          <VerificationButtons
            attrType={attrType}
            requestVerificationCode={this.props.requestVerificationCode}
            resendVerificationCode={this.props.resendVerificationCode}
            enterVerificationCode={this.props.enterVerificationCode}
            smsCode={smsCode}
            value={this.props.identity.userData[this.props.field].value}
            enterField={this.props.enterField}
            codeIsSent={codeIsSent}
            identity={this.props.identity}
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
