import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/identifier'

@connect({
  props: ['registration'],
  actions: ['registration:goForward', 'registration:setEmail']
})
export default class Dialog extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,

    goForward: React.PropTypes.func.isRequired,
    setEmail: React.PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      value={this.props.registration.email.value}
      valid={this.props.registration.email.valid}
      onChange={this.props.setEmail}
      onSubmit={this.props.goForward}
    />
  }
}
