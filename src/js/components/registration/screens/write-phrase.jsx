import React from 'react'
import { connect } from 'redux_state/utils'
import Presentation from '../presentation/write-phrase'

@connect({
  props: ['registration'],
  actions: ['registration:goForward',
    'registration:setPassphraseWrittenDown']
})
export default class RegistrationWritePhraseScreen extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,
    goForward: React.PropTypes.func.isRequired,
    setPassphraseWrittenDown: React.PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.setPassphraseWrittenDown(false)
  }

  render() {
    return <Presentation
      value={this.props.registration.passphrase.phrase}
      onToggle={this.props.setPassphraseWrittenDown}
      onChange={this._handleChange}
      onSubmit={this._handleSubmit}
      isChecked={this.props.registration.passphrase.writtenDown} />
  }
  _handleChange = () => {
    this.props.setPassphraseWrittenDown(false)
  }

  _handleSubmit = () => {
    this.props.setPassphraseWrittenDown(true)
    this.props.goForward()
  }
}
