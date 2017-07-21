import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/access-request'

@connect({
  props: [
    'wallet.accessRequest',
    'wallet.identity'
  ],
  actions: [
    'simple-dialog:configSimpleDialog',
    'simple-dialog:showSimpleDialog',
    'wallet/access-request:goToAccessConfirmation'
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

  render() {
    // console.log(this.props)
    return (
      <Presentation
        identity={this.props.identity}
        entity={this.props.accessRequest.entity}
        accessInfo={this.handleWhy}
        goToAccessConfirmation={this.props.goToAccessConfirmation} />
    )
  }
}
