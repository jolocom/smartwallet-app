import React from 'react'
import Radium from 'radium'
import WalletComingSoon from './coming-soon'
import {
  Container
} from '../../structure'

const STYLES = {
  walletContainer: {
    backgroundColor: '#fff',
    padding: '24px'
  }
}

@Radium
export default class WalletMoney extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  }

  render() {
    return (
      <Container style={STYLES.walletContainer}>
        <WalletComingSoon
          message="We're working on bringing your $$$ identity
          under your control" />
      </Container>
    )
  }
}
