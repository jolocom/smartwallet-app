import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/approval-request'

@connect({
  props: ['ethereumConnect', 'wallet.money'],
  actions: ['ethereum-connect:toggleSecuritySection',
    'ethereum-connect:setFundsNotSufficient',
    'ethereum-connect:getRequestedDetails',
    'ethereum-connect:executeTransaction',
    'confirmation-dialog:openConfirmDialog',
    'wallet/money:retrieveEtherBalance']
})
export default class EthApprovalRequestScreen extends React.Component {
  static propTypes = {
    location: React.PropTypes.object,
    money: React.PropTypes.object,
    ethereumConnect: React.PropTypes.object,
    toggleSecuritySection: React.PropTypes.func.isRequired,
    getRequestedDetails: React.PropTypes.func.isRequired,
    executeTransaction: React.PropTypes.func.isRequired,
    setFundsNotSufficient: React.PropTypes.func.isRequired,
    openConfirmDialog: React.PropTypes.func.isRequired,
    retrieveEtherBalance: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.retrieveEtherBalance()
    this.props.getRequestedDetails(this.props.location)
  }

  handleDialog({title, message, rightButtonLabel, leftButtonLabel}) {
    return this.props.openConfirmDialog(title, message, rightButtonLabel,
      () => this.executeTransaction(), leftButtonLabel)
  }

  executeTransaction() {
    let params = this.props.location.query['params[]']
    if (typeof params === 'string') {
      params = [params]
    }

    this.props.executeTransaction({
      requester: this.props.location.query.requester,
      contractID: this.props.location.query.contractID,
      method: this.props.location.query.method,
      params: params,
      value: this.props.location.query.value,
      returnURL: this.props.location.query.returnURL
    })
  }

  render() {
    if (this.props.money.ether.loaded && this.props.money.ether.amount < parseFloat(this.props.location.query.value)) { // eslint-disable-line max-len
      this.props.setFundsNotSufficient()
    }
    return (
      <Presentation
        toggleSecuritySection={this.props.toggleSecuritySection}
        amount={this.props.location.query.value}
        handleDialog={(...args) => this.handleDialog(...args)}
        executeTransaction={() => this.executeTransaction()}
        ethereumConnect={this.props.ethereumConnect} />
    )
  }
}
