import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/ether-send'

@connect({
  props: ['wallet.money',
          'wallet.etherTabs'],
  actions: [
    'wallet/money:buyEther',
    'wallet/money:goToWalletScreen',
    'wallet/ether-tabs:sendEther',
    'wallet/ether-tabs:updateField'
  ]
})
export default class EtherSendScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    money: React.PropTypes.number.isRequired
  }

  updateField = (value, field) => {
    this.props.updateField({value, field})
  }

  render() {
    return (
      <div>
        <Presentation
          updateField={this.updateField}
          wallet={this.props.etherTabs.wallet}
          ether={this.props.money}
          sendEther={this.props.sendEther} />
      </div>
    )
  }
}
