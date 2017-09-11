import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/ether-receive'

@connect({
  props: ['wallet.money', 'wallet.money.ether.amount', 'wallet.etherTabs'],
  actions: [
    'wallet/money:buyEther',
    'wallet/money:goToWalletScreen',
    'wallet/money:retrieveEtherBalance'
  ]
})
export default class EtherReceiveScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    money: React.PropTypes.object.isRequired,
    amount: React.PropTypes.number.isRequired,
    retrieveEtherBalance: React.PropTypes.func,
    etherTabs: React.PropTypes.object
  }

  componentWillMount() {
    this.props.retrieveEtherBalance()
  }

  render() {
    return (
      <div>
        <Presentation
          money={this.props.money}
          etherBalance={this.props.amount}
          wallet={this.props.etherTabs.wallet} />
      </div>
    )
  }
}
