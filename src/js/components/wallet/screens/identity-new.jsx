import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'redux_state/utils'
import Presentation from '../presentation/identity-new'

@connect({
  props: ['wallet.identityNew'],
  actions: ['wallet/identity-new:toggleEditField',
    'wallet/identity-new:enterField',
    'wallet/identity-new:saveAttribute',
    'wallet/identity-new:toggleQRScan',
    'wallet/identity-new:retrieveAttributes',
    'wallet/identity-new:verifyAttribute',
    'verification:confirmEmail',
    'verification:confirmPhone',
    'verification:startEmailVerification',
    'verification:startPhoneVerification',
    'confirmation-dialog:openConfirmDialog']
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
  }

  componentDidMount() {
    this.props.retrieveAttributes({claims: ['phone', 'name', 'email']})
  }

  requestVerification(...args) {
    return this.showVerificationWindow(...args, ({attrType, attrValue, index}) => { // eslint-disable-line max-len
      if (attrType === 'phone') {
        return () => this.props.startPhoneVerification({phone: attrValue, index}) // eslint-disable-line max-len
      } else if (attrType === 'email') {
        return () => this.props.startEmailVerification({email: attrValue, index}) // eslint-disable-line max-len
      }
    })
  }

  enterVerificationCode({index}) {
    return () => this.props.confirmPhone(index)
  }

  handleConfirmDialog = ({title, message, rightButtonLabel, leftButtonLabel, callback}) => { // eslint-disable-line max-len
    this.props.openConfirmDialog(title, message, rightButtonLabel,
    callback(), leftButtonLabel)
  }

  showVerificationWindow({title, message, attrValue, attrType, index, rightButtonLabel, leftButtonLabel}, callback) { // eslint-disable-line max-len
    return this.props.openConfirmDialog(
      title,
      message,
      rightButtonLabel,
      callback({attrValue, attrType, index}),
      leftButtonLabel
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
        requestVerificationCode={(...args) => this.requestVerification(...args)}
        enterVerificationCode={(...args) => this.showVerificationWindow(...args,
          ({ index }) => this.enterVerificationCode({index})
        )}
        resendVerificationCode={(...args) => this.requestVerification(...args)}
      />
    )
  }
}
