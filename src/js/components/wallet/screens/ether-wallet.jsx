import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/ether-wallet'

@connect({
  props: ['wallet.money'],
  actions: [
    'wallet/money:buyEther',
    'wallet/money:goToWalletScreen'
  ]
})
export default class WalletEtherScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    buyEther: React.PropTypes.func,
    goToWalletScreen: React.PropTypes.func,
    money: React.PropTypes.object
  }

  render() {
    return (<Presentation
      onToken={token => this.props.buyEther({stripeToken: token})}
      goToWalletScreen={this.props.goToWalletScreen}
      ether={this.props.money} />)
  }
}
