import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'redux_state/utils'
import Presentation from '../presentation/phrase'

@connect({
  props: ['walletLogin'],
  actions: [
    'wallet-login:goToLogin',
    'wallet-login:submitPassphrase',
    'wallet-login:setPassphrase',
    'wallet-login:toggleHasOwnURL',
    'wallet-login:setValueOwnURL'
  ]
})
export default class ExpertLoginPassphraseScreen extends React.Component {
  static propTypes = {
    walletLogin: PropTypes.object.isRequired,
    submitPassphrase: PropTypes.func.isRequired,
    setPassphrase: PropTypes.func.isRequired,
    goToLogin: PropTypes.func.isRequired,
    toggleHasOwnURL: PropTypes.func.isRequired,
    setValueOwnURL: PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      back={this.props.goToLogin}
      passphrase={this.props.walletLogin.passphrase}
      canSubmit={this.props.walletLogin.passphrase.value.length > 0}
      onChange={this.props.setPassphrase}
      onSubmit={this.props.submitPassphrase}
      toggleHasOwnURL={(value) => this.props.toggleHasOwnURL(value)}
      setValueOwnURL={(value) => this.props.setValueOwnURL(value)}
    />
  }
}
