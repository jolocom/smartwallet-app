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
    'wallet/ether-tabs:updateField',
    'wallet/ether-tabs:getWalletAddressAndBalance'
  ]
})
export default class EtherSendScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    money: React.PropTypes.object.isRequired,
    updateField: React.PropTypes.func,
    etherTabs: React.PropTypes.object,
    sendEther: React.PropTypes.func,
    getWalletAddressAndBalance: React.PropTypes.func
  }

  componentWillMount() {
    this.props.getWalletAddressAndBalance()
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
