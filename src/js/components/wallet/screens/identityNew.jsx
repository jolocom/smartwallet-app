import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'redux_state/utils'
import Presentation from '../presentation/identityNew'

@connect({
  props: ['wallet.identityNew'],
  actions: ['wallet/identityNew:toggleEditField',
    'wallet/identityNew:enterField',
    'wallet/identityNew:saveAttribute',
    'wallet/identityNew:retrieveAttribute']
})
export default class IdentityScreenNew extends React.Component {
  static propTypes = {
    identityNew: PropTypes.object,
    retrieveAttribute: PropTypes.func.isRequired,
    toggleEditField: PropTypes.func.isRequired,
    saveAttribute: PropTypes.func.isRequired,
    enterField: PropTypes.func.isRequired
  }

  // requestVerificationCode
  // resendVerificationCode
  // enterVerificationCode

  componentDidMount() {
    this.props.retrieveAttribute({claims: ['phone', 'name', 'email']})
  }

  render() {
    return (
      <Presentation
        identityNew={this.props.identityNew}
        enterField={this.props.enterField}
        saveAttribute={this.props.saveAttribute}
        toggleEditField={this.props.toggleEditField}
        setFocusedPin={'true'}
        changePinValue={'true'}
        requestVerificationCode={(...args) => this.requestVerification(...args)}
        resendVerificationCode={(...args) => this.requestVerification(...args)}
        enterVerificationCode={(...args) => this.showVerificationWindow(...args,
          ({ index }) => this.enterVerificationCode({index})
        )}
      />
    )
  }
}
