import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/user-type'

@connect({
  props: ['registration'],
  actions: ['registration:goForward', 'registration:setUserType',
    'confirmation-dialog:openConfirmDialog',
    'confirmation-dialog:closeConfirmDialog',
    'simple-dialog:showSimpleDialog', 'simple-dialog:configSimpleDialog']
})
export default class RegistrationUserTypeScreen extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,
    goForward: React.PropTypes.func.isRequired,
    setUserType: React.PropTypes.func.isRequired,
    openConfirmDialog: React.PropTypes.func.isRequired,
    closeConfirmDialog: React.PropTypes.func.isRequired,
    configSimpleDialog: React.PropTypes.func.isRequired,
    showSimpleDialog: React.PropTypes.func.isRequired
  }

  render() {
    return <div>
      <Presentation
        value={this.props.registration.userType.value}
        valid={this.props.registration.userType.valid}
        onChange={this.props.setUserType}
        onSubmit={this.props.goForward}
        openConfirmDialog={this.props.openConfirmDialog}
        closeConfirmDialog={this.props.closeConfirmDialog}
        configSimpleDialog={this.props.configSimpleDialog}
        showSimpleDialog={this.props.showSimpleDialog}
        user={this.props.registration.humanName.value}
      />
    </div>
  }
}
