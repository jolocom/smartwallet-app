import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/phrase'

@connect({
  props: ['login'],
  actions: [
    'login:submitPassphrase',
    'login:setPassphrase'
  ]
})
export default class ExpertLoginPassphraseScreen extends React.Component {
  static propTypes = {
    login: React.PropTypes.object.isRequired,
    submitPassphrase: React.PropTypes.func.isRequired,
    setPassphrase: React.PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      value={this.props.login.passphrase.value}
      canSubmit={this.props.login.passphrase.value.length > 0}
      onChange={this.props.setPassphrase}
      onSubmit={this.props.submitPassphrase}
      failed={this.props.login.passphrase.failed}
    />
  }
}
