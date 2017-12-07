import PropTypes from 'prop-types';
import React from 'react'
import {connect} from 'redux_state/utils'
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
    children: PropTypes.node,
    buyEther: PropTypes.func,
    goToWalletScreen: PropTypes.func,
    goToAccountDetailsEthereum: PropTypes.func,
    money: PropTypes.object,
    amount: PropTypes.number.isRequired,
    etherTabs: PropTypes.object,
    retrieveEtherBalance: PropTypes.func
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
