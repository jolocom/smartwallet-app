import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/access-request'

@connect({
  props: [
    'singleSignOn.accessRequest',
    'wallet.identity'
  ],
  actions: [
    'simple-dialog:configSimpleDialog',
    'simple-dialog:showSimpleDialog',
    'single-sign-on/access-request:getRequesterIdentity',
    'single-sign-on/access-request:grantAccessToRequester',
    'single-sign-on/access-request:requestedDetails'
  ]
})
export default class AccessRequestScreen extends React.Component {
  static propTypes ={
    configSimpleDialog: React.PropTypes.func.isRequired,
    showSimpleDialog: React.PropTypes.func.isRequired,
    accessRequest: React.PropTypes.obj,
    location: React.PropTypes.obj,
    requestedDetails: React.PropTypes.func.isRequired,
    grantAccessToRequester: React.PropTypes.func.isRequired,
    identity: React.PropTypes.obj
  }

  handleWhy = (title, message) => {
    this.props.configSimpleDialog(title, message, 'OK', {}, false)
    this.props.showSimpleDialog()
  }

  componentWillMount() {
    this.props.requestedDetails(this.props.location.query)
  }
  render() {
    return (
      <Presentation
        requestedFields={this.props.accessRequest.entity.fields}
        location={this.props.location.query}
        identity={this.props.identity}
        entity={this.props.accessRequest.entity}
        accessInfo={(...args) => { this.handleWhy(...args) }}
        grantAccessToRequester={this.props.grantAccessToRequester} />
    )
  }
}
