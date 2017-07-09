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

  buyEther(token) {
    this.props.buyEther(token)
  }

  render() {
    return (<Presentation
      buyEther={this.buyEther.bind(this)}
      ether={this.props.money} />)
  }
}
