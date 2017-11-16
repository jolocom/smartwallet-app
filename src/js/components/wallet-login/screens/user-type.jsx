import React from 'react'
import { connect } from 'redux_state/utils'
import Presentation from '../presentation/user-type'

@connect({
  props: ['walletLogin'],
  actions: [
    'wallet-login:setUserType',
    'wallet-login:storeCallbackUrl',
    'simple-dialog:showSimpleDialog',
    'simple-dialog:configSimpleDialog'
  ]
})
export default class LoginUserTypeScreen extends React.Component {
  static propTypes = {
    location: React.PropTypes.object.isRequired,
    walletLogin: React.PropTypes.object.isRequired,
    setUserType: React.PropTypes.func.isRequired,
    configSimpleDialog: React.PropTypes.func.isRequired,
    showSimpleDialog: React.PropTypes.func.isRequired,
    storeCallbackUrl: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    if (this.props.location && this.props.location.query.callbackUrl) {
      this.props.storeCallbackUrl(this.props.location.query.callbackUrl)
    }
  }
  render() {
    return (
      <Presentation
        value={this.props.walletLogin.userType.value}
        valid={this.props.walletLogin.userType.valid}
        onSelect={this._handleClick}
        onWhySelect={this._handleWhy} />
    )
  }

  _handleClick = (value) => {
    this.props.setUserType(value)
  }

  _handleWhy = (message) => {
    this.props.configSimpleDialog(null, message, 'OK', {}, true)
    this.props.showSimpleDialog()
  }

}
