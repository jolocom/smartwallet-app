import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/user-type'

@connect({
  props: ['registration'],
  actions: ['registration:goForward', 'registration:setUserType',
    'confirmation-dialog:openConfirmDialog',
    'confirmation-dialog:closeConfirmDialog',
    'simple-dialog:openSimpleDialog', 'simple-dialog:closeSimpleDialog']
})
export default class RegistrationUserTypeScreen extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,
    goForward: React.PropTypes.func.isRequired,
    setUserType: React.PropTypes.func.isRequired,
    openConfirmDialog: React.PropTypes.func.isRequired,
    closeConfirmDialog: React.PropTypes.func.isRequired,
    openSimpleDialog: React.PropTypes.func.isRequired,
    closeSimpleDialog: React.PropTypes.func.isRequired
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
        openSimpleDialog={this.props.openSimpleDialog}
        closeSimpleDialog={this.props.closeSimpleDialog}
        user={this.props.registration.humanName}
      />
    </div>
  }
}
