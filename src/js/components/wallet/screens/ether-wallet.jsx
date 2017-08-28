import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/ether-wallet'

@connect({
  props: ['wallet.money', 'wallet.etherTabs'],
  actions: [
    'wallet/money:buyEther',
    'wallet/money:goToWalletScreen',
    'wallet/money:goToAccountDetailsEthereum',
    'wallet/ether-tabs:getWalletAddress'
  ]
})
export default class WalletEtherScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    buyEther: React.PropTypes.func,
    goToWalletScreen: React.PropTypes.func,
    goToAccountDetailsEthereum: React.PropTypes.func,
    money: React.PropTypes.object,
    etherTabs: React.PropTypes.object,
    getWalletAddress: React.PropTypes.func
  }

  componentDidMount() {
    this.props.getWalletAddress()
  }
  render() {
    return (<Presentation
      onToken={token => this.props.buyEther({stripeToken: token})}
      goToWalletScreen={this.props.goToWalletScreen}
      wallet={this.props.etherTabs.wallet}
      goToAccountDetailsEthereum={this.props.goToAccountDetailsEthereum}
      ether={this.props.money} />)
  }
}
