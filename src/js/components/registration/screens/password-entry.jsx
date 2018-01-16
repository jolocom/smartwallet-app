import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'redux_state/utils'
import Presentation from '../presentation/password-entry'

@connect({
  props: ['registration'],
  actions: ['registration:checkPassword',
    'registration:generateAndEncryptKeyPairs']
})
export default class PasswordEntryScreen extends React.Component {
  static propTypes = {
    registration: PropTypes.object,
    checkPassword: PropTypes.func.isRequired,
    generateAndEncryptKeyPairs: PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      security={this.props.registration.encryption}
      checkPassword={this.props.checkPassword}
      generateAndEncryptKeyPairs={
        this.props.generateAndEncryptKeyPairs
      } />
  }
}
