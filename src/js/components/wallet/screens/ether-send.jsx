import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/ether-send'

@connect({
  props: ['wallet.money',
          'wallet.etherTabs'],
  actions: [
    'wallet/money:buyEther',
    'wallet/money:goToWalletScreen',
    'wallet/ether-tabs:sendEther'
  ]
})
export default class EtherSendScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    money: React.PropTypes.number.isRequired
  }

  render() {
    return (
      <div>
        <Presentation
          ether={this.props.money}
          sendEther={this.props.sendEther} />
      </div>
    )
  }
}
