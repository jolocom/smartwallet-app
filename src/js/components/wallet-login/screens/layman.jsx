import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/layman'

@connect({
  props: ['walletLogin'],
  actions: [
    'wallet-login:goToLogin',
    'wallet-login:setUsername',
    'wallet-login:setPassword',
    'wallet-login:submitLogin'
  ]
})
export default class LaymanLoginScreen extends React.Component {
  static propTypes = {
    walletLogin: React.PropTypes.object.isRequired,
    setUsername: React.PropTypes.func.isRequired,
    setPassword: React.PropTypes.func.isRequired,
    submitLogin: React.PropTypes.func.isRequired,
    goToLogin: React.PropTypes.func.isRequired
  }
  render() {
    return <Presentation
      back={this.props.goToLogin}
      username={this.props.walletLogin.login.username}
      password={this.props.walletLogin.login.password}
      onUsernameChange={this.onUsernameChange}
      onPasswordChange={this.onPasswordChange}
      onSubmit={this.props.submitLogin}
      failed={this.props.walletLogin.login.failed}
    />
  }

  onUsernameChange = (e) => {
    return this.props.setUsername(e.target.value)
  }

  onPasswordChange = (e) => {
    return this.props.setPassword(e.target.value)
  }
}
