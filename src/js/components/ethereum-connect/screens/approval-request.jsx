import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/approval-request'
import ErrorScreen from '../../common/error'
import LoadingScreen from '../../common/loading'

@connect({
  props: ['ethereumConnect', 'wallet.money'],
  actions: ['ethereum-connect:toggleSecuritySection',
    'ethereum-connect:setFundsNotSufficient',
    'ethereum-connect:getRequestedDetails',
    'ethereum-connect:executeTransaction']
})
export default class EthApprovalRequestScreen extends React.Component {
  static propTypes = {
    location: React.PropTypes.object,
    money: React.PropTypes.object,
    ethereumConnect: React.PropTypes.object,
    toggleSecuritySection: React.PropTypes.func.isRequired,
    getRequestedDetails: React.PropTypes.func.isRequired,
    executeTransaction: React.PropTypes.func.isRequired,
    setFundsNotSufficient: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.getRequestedDetails(this.props.location)
    if (this.props.money.ether.amount < this.props.location.query.value) {
      this.props.setFundsNotSufficient()
    }
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
    console.log(this.props)
    return (
      <Presentation
        toggleSecuritySection={this.props.toggleSecuritySection}
        executeTransaction={() => this.executeTransaction()}
        ethereumConnect={this.props.ethereumConnect} />
    )
  }
}
