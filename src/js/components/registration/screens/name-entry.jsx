import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/name-entry'

@connect({
  props: ['registration'],
  actions: ['registration:goForward', 'registration:setHumanName']
})
export default class RegistrationNameEntryScreen extends React.Component {
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
