import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/ether-receive'

@connect({
  props: ['wallet.money', 'wallet.etherTabs'],
  actions: [
    'wallet/money:buyEther',
    'wallet/money:goToWalletScreen',
    'wallet/ether-tabs:getWalletAddressAndBalance'
  ]
})
export default class EtherReceiveScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    money: React.PropTypes.object.isRequired,
    getWalletAddressAndBalance: React.PropTypes.func,
    etherTabs: React.PropTypes.object
  }

  componentWillMount() {
    this.props.getWalletAddressAndBalance()
  }

  render() {
    return (
      <div>
        <Presentation
          ether={this.props.money}
          wallet={this.props.etherTabs.wallet} />
      </div>
    )
  }
}
