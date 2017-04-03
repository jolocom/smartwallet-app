import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/name-entry'

@connect({
  props: ['registration'],
  actions: ['registration:setUsername', 'registration:checkUsername']
})
export default class RegistrationNameEntryScreen extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,

    checkUsername: React.PropTypes.func.isRequired,
    setUsername: React.PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      value={this.props.registration.username.value}
      alphaNum={this.props.registration.username.alphaNum}
      errorMsg={this.props.registration.username.errorMsg}
      checking={this.props.registration.username.checking}
      onChange={this.props.setUsername}
      onSubmit={this.props.checkUsername}
    />
  }
}
