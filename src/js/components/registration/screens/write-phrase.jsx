import React from 'react'
import Radium from 'radium'
import { connect } from 'redux/utils'
import Presentation from '../presentation/write-phrase'

@connect({
  props: ['registration'],
  actions: ['registration:goForward', 'registration:setPassphraseWrittenDown']
})
@Radium
export default class RegistrationWritePhraseScreen extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,

    goForward: React.PropTypes.func.isRequired,
    setPassphraseWrittenDown: React.PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      value={this.props.registration.passphrase.writtenDown}
      valid={this.props.registration.passphrase.valid}
      onChange={this.props.setPassphraseWrittenDown}
      onSubmit={this.props.goForward}
    />
  }
}
