import React from 'react'
import { connect } from 'redux_state/utils'
import Presentation from '../presentation/name-entry'

@connect({
  props: ['registration'],
  actions: ['registration:setUsername',
    'registration:checkCredentials',
    'registration:toggleHasOwnURL',
    'registration:setValueOwnURL',
    'simple-dialog:configMsg',
    'simple-dialog:showDialog'
  ]
})
export default class RegistrationNameEntryScreen extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,
    checkCredentials: React.PropTypes.func.isRequired,
    setUsername: React.PropTypes.func.isRequired,
    configMsg: React.PropTypes.func.isRequired,
    showDialog: React.PropTypes.func.isRequired,
    toggleHasOwnURL: React.PropTypes.func.isRequired,
    setValueOwnURL: React.PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      ownURL={this.props.registration.ownURL}
      toggleHasOwnURL={(value) => this.props.toggleHasOwnURL(value)}
      setValueOwnURL={(value) => this.props.setValueOwnURL(value)}
      value={this.props.registration.username.value}
      valid={this.props.registration.username.valid}
      alphaNum={this.props.registration.username.alphaNum}
      errorMsg={this.props.registration.username.errorMsg}
      checking={this.props.registration.username.checking}
      onChange={this.props.setUsername}
      onSubmit={this.props.checkCredentials}
      handleDialog={this._handleDialog} />
  }
  _handleDialog = (title, message) => {
    this.props.configMsg(title, message, 'OK')
    this.props.showDialog()
  }
}
