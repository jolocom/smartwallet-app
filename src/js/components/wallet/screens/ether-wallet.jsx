import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/ether-wallet'

@connect({
  props: ['wallet.money', 'wallet.money.ether.amount', 'wallet.etherTabs'],
  actions: [
    'wallet/money:buyEther',
    'wallet/money:goToWalletScreen',
    'wallet/money:goToAccountDetailsEthereum',
    'wallet/money:retrieveEtherBalance'
  ]
})
export default class WalletEtherScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    buyEther: React.PropTypes.func,
    goToWalletScreen: React.PropTypes.func,
    goToAccountDetailsEthereum: React.PropTypes.func,
    money: React.PropTypes.object,
    amount: React.PropTypes.number.isRequired,
    etherTabs: React.PropTypes.object,
    retrieveEtherBalance: React.PropTypes.func
  }

  componentDidMount() {
    this.props.retrieveEtherBalance()
  }
  render() {
    return (<Presentation
      onToken={token => this.props.buyEther({stripeToken: token})}
      goToWalletScreen={this.props.goToWalletScreen}
      wallet={this.props.etherTabs.wallet}
      goToAccountDetailsEthereum={this.props.goToAccountDetailsEthereum}
      money={this.props.money}
      etherBalance={this.props.amount}
    />)
  }
}
