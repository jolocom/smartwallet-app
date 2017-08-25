import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/account-details-ethereum'

@connect({
  props: ['wallet.etherTabs'],
  actions: ['wallet/ether-tabs:getWalletAddress',
    'wallet/ether-tabs:closeAccountDetails']
})
export default class AccountDetailsEthereum extends React.Component {
  static propTypes = {
    closeAccountDetails: React.PropTypes.func,
    etherTabs: React.PropTypes.object,
    getWalletAddress: React.PropTypes.func
  }

  componentWillMount() {
    this.props.getWalletAddress()
  }
  render() {
    const walletAddress = this.props.etherTabs.wallet.walletAddress
    return (
      <Presentation
        onClose={this.props.closeAccountDetails}
        mainAddress={walletAddress} />
    )
  }
}
