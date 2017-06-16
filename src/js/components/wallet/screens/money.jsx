import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/money'

@connect({
  props: ['wallet'],
  actions: [
    'wallet/money:goToEtherManagement',
    'wallet/money:buyEther',
    'wallet/money:getBalance'
  ]
})
export default class WalletMoneyScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    goToEtherManagement: React.PropTypes.func.isRequired,
    buyEther: React.PropTypes.func.isRequired,
    getBalance: React.PropTypes.func.isRequired
  }

  render() {
    const {goToEtherManagement, buyEther, getBalance} = this.props
    return (<Presentation
      goToEtherManagement={goToEtherManagement}
      buyEther={buyEther}
      getBalance={getBalance} />)
  }
}
