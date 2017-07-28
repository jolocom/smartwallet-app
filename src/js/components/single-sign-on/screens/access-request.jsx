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
    'single-sign-on/access-request:goToAccessConfirmation'
  ]
})
export default class AccessRequestScreen extends React.Component {
  static propTypes ={
    goToAccessConfirmation: React.PropTypes.func.isRequired,
    configSimpleDialog: React.PropTypes.func.isRequired,
    showSimpleDialog: React.PropTypes.func.isRequired,
    accessRequest: React.PropTypes.obj
  }

  handleWhy = (title, message) => {
    this.props.configSimpleDialog(title, message, 'OK', {}, false)
    this.props.showSimpleDialog()
  }

  componentWillMount() {
    console.log(this.props.location.query)
  }
  render() {
    // console.log(this.props.location.query)
    return (
      <Presentation
        requestedFields={this.props.location.query['scope[]']}
        identity={this.props.identity}
        entity={this.props.accessRequest.entity}
        accessInfo={this.handleWhy}
        goToAccessConfirmation={this.props.goToAccessConfirmation} />
    )
  }
}
