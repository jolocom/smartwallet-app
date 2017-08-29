import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/money'

@connect({
  props: ['wallet.money'],
  actions: [
    'wallet/money:goToEtherManagement',
    'wallet/money:buyEther',
    'wallet/money:getPrice',
    'wallet/money:getBalance',
    'wallet/money:getWalletAddressAndBalance'
  ]
})
export default class WalletMoneyScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    money: React.PropTypes.any,
    goToEtherManagement: React.PropTypes.func.isRequired,
    buyEther: React.PropTypes.func.isRequired,
    getPrice: React.PropTypes.func.isRequired,
    getBalance: React.PropTypes.func.isRequired,
    getWalletAddressAndBalance: React.PropTypes.func.isRequired
  }
  componentWillMount() {
    this.props.getWalletAddressAndBalance()
    // this.props.getPrice()
  }
  render() {
    const {goToEtherManagement, buyEther, getBalance} = this.props
    const {ether} = this.props.money
    return (<Presentation
      ether={ether}
      goToEtherManagement={goToEtherManagement}
      buyEther={buyEther}
      getBalance={getBalance} />)
  }
}
