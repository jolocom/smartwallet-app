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
export default class IdentityScreenNew extends React.Component {
  static propTypes = {
    identityNew: PropTypes.object,
    retrieveAttributes: PropTypes.func.isRequired,
    toggleEditField: PropTypes.func.isRequired,
    toggleQRScan: PropTypes.func.isRequired,
    saveAttribute: PropTypes.func.isRequired,
    enterField: PropTypes.func.isRequired,
    verifyAttribute: PropTypes.func,
    startPhoneVerification: PropTypes.func.isRequired,
    startEmailVerification: PropTypes.func.isRequired,
    confirmPhone: PropTypes.func.isRequired,
    confirmEmail: PropTypes.func.isRequired,
    changePinValue: PropTypes.func.isRequired,
    setFocusedPin: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.retrieveAttributes({claims: ['phone', 'name', 'email']})
  }

  requestVerification(...args) {
    return this.showVerificationWindow(...args, ({attrType, attrValue}) => { // eslint-disable-line max-len
      if (attrType === 'phone') {
        console.log('HERE ' + attrType, + "   " + attrValue)
        return this.props.startPhoneVerification({phone: attrValue}) // eslint-disable-line max-len
      } else if (attrType === 'email') {
        return this.props.startEmailVerification({email: attrValue, index}) // eslint-disable-line max-len
      }
    })
  }

  enterVerificationCode(...args) {
    console.log(args)
    return this.showVerificationWindow(...args, ({attrType, attrValue}) => {
      return this.props.confirmPhone()
    })
  }

  handleConfirmDialog = ({title, message, rightButtonLabel, leftButtonLabel, callback}) => { // eslint-disable-line max-len
    this.props.openConfirmDialog(title, message, rightButtonLabel,
    callback(), leftButtonLabel)
  }

  showVerificationWindow({title, message, attrValue, attrType, rightButtonLabel, leftButtonLabel}, callback) { // eslint-disable-line max-len
    return this.props.openConfirmDialog(
      {title,
      message,
      primaryActionText: rightButtonLabel,
      callback: callback({attrValue, attrType}),
      cancelActionText: leftButtonLabel}
    )
  }

  render() {
    return (
      <Presentation
        identityNew={this.props.identityNew}
        enterField={this.props.enterField}
        saveAttribute={this.props.saveAttribute}
        toggleEditField={this.props.toggleEditField}
        toggleQRScan={this.props.toggleQRScan}
        verifyAttribute={this.props.verifyAttribute}
        onConfirm={(...args) => { this.handleConfirmDialog(...args) }}
        setFocusedPin={this.props.setFocusedPin}
        changePinValue={this.props.changePinValue}
        requestVerificationCode={(...args) => this.requestVerification(...args)}
        enterVerificationCode={(...args) =>
          this.enterVerificationCode(...args)
        }
        resendVerificationCode={(...args) => this.requestVerification(...args)}
      />
    )
  }
}
