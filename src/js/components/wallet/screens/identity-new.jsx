import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'redux_state/utils'
import Presentation from '../presentation/identity-new'

@connect({
  props: ['wallet.identityNew'],
  actions: [
    'wallet/identity-new:toggleEditField',
    'wallet/identity-new:enterField',
    'wallet/identity-new:saveAttribute',
    'wallet/identity-new:toggleQRScan',
    'wallet/identity-new:retrieveAttributes',
    'wallet/identity-new:verifyAttribute',
    'verification:confirmEmail',
    'verification:confirmPhone',
    'wallet/identity:setFocusedPin',
    'wallet/identity:changePinValue',
    'verification:startEmailVerification',
    'verification:startPhoneVerification',
    'confirmation-dialog:openConfirmDialog'
  ]
})
export default class IdentityScreenNew extends React.PureComponent {
  static propTypes = {
    identityNew: PropTypes.object,
    retrieveAttributes: PropTypes.func.isRequired,
    toggleEditField: PropTypes.func.isRequired,
    toggleQRScan: PropTypes.func.isRequired,
    saveAttribute: PropTypes.func.isRequired,
    enterField: PropTypes.func.isRequired,
    startPhoneVerification: PropTypes.func.isRequired,
    startEmailVerification: PropTypes.func.isRequired,
    confirmPhone: PropTypes.func.isRequired,
    confirmEmail: PropTypes.func.isRequired,
    openConfirmDialog: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.retrieveAttributes({claims: ['phone', 'name', 'email']})
  }

  requestVerification(...args) {
    return this.showVerificationWindow(...args, ({attrType, attrValue}) => {
      if (attrType === 'phone') {
        return this.props.startPhoneVerification
      } else if (attrType === 'email') {
        return this.props.startEmailVerification
      }
    })
  }

  enterVerificationCode(...args) {
    return this.showVerificationWindow(...args, ({attrType, attrValue}) => {
      if (attrType === 'phone') {
        return this.props.confirmPhone
      } else if (attrType === 'email') {
        return this.props.confirmEmail
      }
    })
  }

  handleConfirmDialog =
    ({title, message, rightButtonLabel, leftButtonLabel, callback}) => {
      this.props.openConfirmDialog(title, message, rightButtonLabel,
      callback(), leftButtonLabel)
    }

  showVerificationWindow(
    {title, message, attrValue, attrType, rightButtonLabel, leftButtonLabel},
    callback
  ) {
    return this.props.openConfirmDialog({
      title,
      message,
      primaryActionText: rightButtonLabel,
      callback: callback({attrValue, attrType}), // eslint-disable-line
      cancelActionText: leftButtonLabel
    })
  }

  render() {
    return (
      <Presentation
        identityNew={this.props.identityNew}
        enterField={this.props.enterField}
        saveAttribute={this.props.saveAttribute}
        toggleEditField={this.props.toggleEditField}
        toggleQRScan={this.props.toggleQRScan}
        onConfirm={(...args) => { this.handleConfirmDialog(...args) }}
        requestVerificationCode={(...args) => this.requestVerification(...args)}
        enterVerificationCode={(...args) =>
          this.enterVerificationCode(...args)
        }
        resendVerificationCode={(...args) => this.requestVerification(...args)}
      />
    )
  }
}
