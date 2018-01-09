import PropTypes from 'prop-types';
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
    registration: PropTypes.object.isRequired,
    goForward: PropTypes.func.isRequired,
    setPassphraseWrittenDown: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.setPassphraseWrittenDown({value: false})
  }

  render() {
    return <Presentation
      value={this.props.registration.passphrase.phrase}
      onToggle={this._handleToggle}
      onSubmit={this._handleSubmit}
      isChecked={this.props.registration.passphrase.writtenDown} />
  }

  _handleSubmit = () => {
    this.props.goForward()
  }

  _handleToggle = (value) => {
    this.props.setPassphraseWrittenDown({value})
  }
}
