import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'redux_state/utils'
import Presentation from '../presentation/password-entry'

@connect({
  props: ['registration'],
  actions: [
    'registration:setPassword',
    'registration:setReentryPassword',
    'registration:generateAndEncryptKeyPairs']
})
export default class PasswordEntryScreen extends React.Component {
  static propTypes = {
    registration: PropTypes.object,
    setPassword: PropTypes.func.isRequired,
    setReentryPassword: PropTypes.func.isRequired,
    generateAndEncryptKeyPairs: PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      security={this.props.registration.encryption}
      progress={this.props.registration.progress}
      setPassword={this.props.setPassword}
      setReentryPassword={this.props.setReentryPassword}
      generateAndEncryptKeyPairs={this.props.generateAndEncryptKeyPairs}
    />
  }
}
