import React from 'react'
import Radium from 'radium'
import WalletComingSoon from './coming-soon'
@Radium
export default class WalletMoney extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  }

  render() {
    return (
      <WalletComingSoon
        message="We're working on bringing your $$$ identity
        under your control" />
    )
  }
}
