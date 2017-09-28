import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/approval-request'
import ErrorScreen from '../../common/error'
import LoadingScreen from '../../common/loading'

@connect({
  props: ['ethereumConnect', 'wallet.money'],
  actions: ['ethereum-connect:toggleSecuritySection',
    'ethereum-connect:setFundsNotSufficient',
    'ethereum-connect:getRequestedDetails']
})
export default class EthApprovalRequestScreen extends React.Component {
  static propTypes = {
    location: React.PropTypes.object,
    money: React.PropTypes.object,
    ethereumConnect: React.PropTypes.object,
    toggleSecuritySection: React.PropTypes.func.isRequired,
    getRequestedDetails: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    let costs = '0.4'
    this.props.getRequestedDetails(this.props.location)
    if (this.props.money.ether.amount < costs) {
      // this.props.setFundsNotSufficient()
    }
  }

  render() {
    console.log(this.props)
    return (
      <Presentation
        toggleSecuritySection={this.props.toggleSecuritySection}
        ethereumConnect={this.props.ethereumConnect} />
    )
  }
}
