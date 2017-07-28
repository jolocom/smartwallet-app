import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/ether-send'

@connect({
  props: ['wallet.money'],
  actions: [
    'wallet/money:buyEther',
    'wallet/money:goToWalletScreen'
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
          ether={this.props.money} />
      </div>
    )
  }
}
