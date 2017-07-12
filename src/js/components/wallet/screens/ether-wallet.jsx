import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/ether-wallet'

@connect({
  props: ['wallet.money'],
  actions: [
    'wallet/money:buyEther'
  ]
})
export default class WalletEtherScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    buyEther: React.PropTypes.func,
    money: React.PropTypes.object
  }

  render() {
    return (<Presentation
      buyEther={this.props.buyEther}
      ether={this.props.money} />)
  }
}
