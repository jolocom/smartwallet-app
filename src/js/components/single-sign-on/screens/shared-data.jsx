import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/shared-data'
import ErrorScreen from '../../common/error'

@connect({
  props: ['singleSignOn.accessRight'],
  actions: [
    'single-sign-on/access-right:deleteService',
    'single-sign-on/access-right:goToAccessRightScreen',
    'confirmation-dialog:openConfirmDialog',
    'confirmation-dialog:closeConfirmDialog'
  ]
})
export default class SingleSignOnSharedDatatScreen extends React.Component {
  static propTypes = {
    deleteService: React.PropTypes.func,
    goToAccessRightScreen: React.PropTypes.func,
    openConfirmDialog: React.PropTypes.func,
    closeConfirmDialog: React.PropTypes.func,
    accessRight: React.PropTypes.object
  }

  render() {
    let {serviceNumber, services} = this.props.accessRight
    if (services.length > 0) {
      return (<Presentation
        deleteService={
        ({title, message, style, rightButtonLabel, leftButtonLabel}) => {
          this.props.openConfirmDialog(title, message, rightButtonLabel,
          () => {
            this.props.deleteService(serviceNumber)
            this.props.goToAccessRightScreen()
          }, leftButtonLabel, style)
        }}
        serviceUrl={services[serviceNumber].url}
        sharedData={services[serviceNumber].sharedData}
        serviceName={services[serviceNumber].displayName}
        showDeleteServiceWindow={(
        {title, message, style, rightButtonLabel, leftButtonLabel}) => {
          this.props.openConfirmDialog(title, message, rightButtonLabel,
            () => { this.props.deleteService(serviceNumber) }, leftButtonLabel,
            style)
        }}
        goToAccessRightScreen={this.props.goToAccessRightScreen} />)
    }
    return <ErrorScreen
      message=""
      buttonLabel="try again..."
      onClick={this.render} />
  }
}
