import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/ether-receive'

@connect({
  props: ['wallet.money', 'wallet.etherTabs'],
  actions: [
    'wallet/money:buyEther',
    'wallet/money:goToWalletScreen',
    'wallet/ether-tabs:getWalletAddress'
  ]
})
export default class EtherReceiveScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    money: React.PropTypes.object.isRequired,
    getWalletAddress: React.PropTypes.func,
    etherTabs: React.PropTypes.object
  }

  componentDidMount() {
    this.props.getWalletAddress()
  }
  render() {
    return (
      <div>
        <Presentation
          ether={this.props.money}
          address={this.props.etherTabs.wallet.mainAddress} />
      </div>
    )
  }
}
