import React from 'react'
import Radium from 'radium'
import { connect } from 'redux/utils'
import Presentation from '../presentation/password'

@connect({
  props: ['registration'],
  actions: ['registration:goForward', 'registration:setHumanName']
})
@Radium
export default class RegistrationPasswordScreen extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,

    goForward: React.PropTypes.func.isRequired,
    setHumanName: React.PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      value={this.props.registration.humanName.value}
      valid={this.props.registration.humanName.valid}
      onChange={this.props.setHumanName}
      onSubmit={this.props.goForward}
    />
  }
}
