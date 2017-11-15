import React from 'react'
import {connect} from 'redux_state/utils'
import Presentation from '../presentation/money'

@connect({
  props: ['wallet.money', 'wallet.money.ether.amount'],
  actions: [
    'wallet/money:goToEtherManagement',
    'wallet/money:buyEther',
    'wallet/money:getPrice',
    'wallet/money:retrieveEtherBalance'
  ]
})
export default class WalletMoneyScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    money: React.PropTypes.any,
    amount: React.PropTypes.number.isRequired,
    goToEtherManagement: React.PropTypes.func.isRequired,
    buyEther: React.PropTypes.func.isRequired,
    getPrice: React.PropTypes.func.isRequired,
    retrieveEtherBalance: React.PropTypes.func.isRequired
  }
  componentDidMount() {
    this.props.retrieveEtherBalance()
    this.props.getPrice()
  }
  render() {
    const {goToEtherManagement, buyEther, retrieveEtherBalance} = this.props
    const {ether} = this.props.money
    return (<Presentation
      ether={ether}
      etherBalance={this.props.amount}
      goToEtherManagement={goToEtherManagement}
      buyEther={buyEther}
      getBalance={retrieveEtherBalance} />)
  }
}
