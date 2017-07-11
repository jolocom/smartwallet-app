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
    money: React.PropTypes.object.isRequired,
    goToEtherManagement: React.PropTypes.func.isRequired,
    getPrice: React.PropTypes.func.isRequired,
    getBalance: React.PropTypes.func.isRequired
  }
  componentWillMount() {
    this.props.getPrice()
    this.props.getBalance()
  }
  render() {
    const {goToEtherManagement, money} = this.props
    return (<Presentation
      ether={money.ether}
      goToEtherManagement={goToEtherManagement} />)
  }
}
