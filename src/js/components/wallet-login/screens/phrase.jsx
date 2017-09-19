import React from 'react'
import { connect } from 'redux/utils'
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
    walletLogin: React.PropTypes.object.isRequired,
    submitPassphrase: React.PropTypes.func.isRequired,
    setPassphrase: React.PropTypes.func.isRequired,
    goToLogin: React.PropTypes.func.isRequired,
    toggleHasOwnURL: React.PropTypes.func.isRequired,
    setValueOwnURL: React.PropTypes.func.isRequired
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
