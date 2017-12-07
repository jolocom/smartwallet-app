import PropTypes from 'prop-types';
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
    children: PropTypes.node,
    money: PropTypes.any,
    amount: PropTypes.number.isRequired,
    goToEtherManagement: PropTypes.func.isRequired,
    buyEther: PropTypes.func.isRequired,
    getPrice: PropTypes.func.isRequired,
    retrieveEtherBalance: PropTypes.func.isRequired
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
