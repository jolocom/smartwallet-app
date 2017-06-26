import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/money'

@connect({
  props: ['wallet.money'],
  actions: [
    'wallet/money:goToEtherManagement',
    'wallet/money:buyEther',
    'wallet/money:getPrice',
    'wallet/money:getBalance'
  ]
})
export default class WalletMoneyScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    money: React.PropTypes.object.isRequired,
    goToEtherManagement: React.PropTypes.func.isRequired,
    buyEther: React.PropTypes.func.isRequired,
    getPrice: React.PropTypes.func.isRequired,
    getBalance: React.PropTypes.func.isRequired
  }
  componentWillMount() {
    this.props.getPrice()
    this.props.getBalance()
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
