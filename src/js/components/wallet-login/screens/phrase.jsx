import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/phrase'

@connect({
  props: ['walletLogin'],
  actions: [
    'wallet-login:goToLogin',
    'wallet-login:submitPassphrase',
    'wallet-login:setPassphrase'
  ]
})
export default class ExpertLoginPassphraseScreen extends React.Component {
  static propTypes = {
    walletLogin: React.PropTypes.object.isRequired,
    submitPassphrase: React.PropTypes.func.isRequired,
    setPassphrase: React.PropTypes.func.isRequired,
    goToLogin: React.PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      back={this.props.goToLogin}
      value={this.props.walletLogin.passphrase.value}
      canSubmit={this.props.walletLogin.passphrase.value.length > 0}
      onChange={this.props.setPassphrase}
      onSubmit={this.props.submitPassphrase}
      failed={this.props.walletLogin.passphrase.failed}
    />
  }
}
