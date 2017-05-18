import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/user-type'

@connect({
  props: ['registration'],
  actions: ['registration:goForward', 'registration:setUserType',
    'simple-dialog:showSimpleDialog', 'simple-dialog:configSimpleDialog']
})
export default class RegistrationUserTypeScreen extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,
    goForward: React.PropTypes.func.isRequired,
    setUserType: React.PropTypes.func.isRequired,
    configSimpleDialog: React.PropTypes.func.isRequired,
    showSimpleDialog: React.PropTypes.func.isRequired
  }

  render() {
    return (
      <Presentation
        value={this.props.registration.userType.value}
        valid={this.props.registration.userType.valid}
        onSelect={this._handleClick}
        onWhySelect={this._handleWhy}
        user={this.props.registration.username.value} />
    )
  }

  _handleClick = (value) => {
    this.props.setUserType(value)
    this.props.goForward()
  }
  _handleWhy = (message) => {
    this.props.configSimpleDialog(null, message, 'OK', {}, true)
    this.props.showSimpleDialog()
  }

}
