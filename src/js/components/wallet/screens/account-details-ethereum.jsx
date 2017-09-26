import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/account-details-ethereum'

@connect({
  props: ['wallet.money'],
  actions: ['wallet/ether-tabs:closeAccountDetails']
})
export default class AccountDetailsEthereum extends React.Component {
  static propTypes = {
    closeAccountDetails: React.PropTypes.func,
    money: React.PropTypes.object
  }

  render() {
    return (
      <Presentation
        onClose={this.props.closeAccountDetails}
        wallet={this.props.money} />
    )
  }
}
