import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/name-entry'
const STYLES = {
  dialog: {
    contentStyle: {
      textAlign: 'center'
    },
    actionsContainerStyle: {
      textAlign: 'center'
    }
  }
}

@connect({
  props: ['registration'],
  actions: ['registration:setUsername',
    'registration:checkUsername',
    'simple-dialog:configSimpleDialog',
    'simple-dialog:showSimpleDialog'
  ]
})
export default class RegistrationNameEntryScreen extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,
    checkUsername: React.PropTypes.func.isRequired,
    setUsername: React.PropTypes.func.isRequired,
    configSimpleDialog: React.PropTypes.func.isRequired,
    showSimpleDialog: React.PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      value={this.props.registration.username.value}
      valid={this.props.registration.username.valid}
      alphaNum={this.props.registration.username.alphaNum}
      errorMsg={this.props.registration.username.errorMsg}
      checking={this.props.registration.username.checking}
      onChange={this.props.setUsername}
      onSubmit={this.props.checkUsername}
      handleDialog={this._handleDialog} />
  }
  _handleDialog = (message) => {
    this.props.configSimpleDialog(message, 'OK', STYLES.dialog)
    this.props.showSimpleDialog()
  }
}
