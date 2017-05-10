import React from 'react'
import Radium from 'radium'
import {
  Container,
  Block,
  Footer,
  SideNote
} from '../../structure'
import {theme} from 'styles'

import {
  FlatButton
} from 'material-ui'

const STYLES = {
  greeting: {
    fontSize: '20px',
    color: theme.palette.textColor
  },
  walletContainer: {
    backgroundColor: 'none',
    padding: '24px'
  },
  homeImg: {
    height: '60%',
    maxWidth: '40%'
  }
}

@Radium
export default class WalletHome extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    onClick: React.PropTypes.func.isRequired,
    username: React.PropTypes.string.isRequired
  }

  render() {
    // TODO replace placeholder img
    return (
      <Container style={STYLES.walletContainer}>
        <img src="/img/illu_wallet.svg" style={STYLES.homeImg} />
        <Block>
          <h1 style={STYLES.greeting}>Hi {this.props.username}</h1>
        </Block>
        <Block>
          <SideNote>
            Get started with adding your data and request verification. You
            only only need to do this once and then you can use it for further
            services
          </SideNote>
        </Block>
        <Footer>
          <FlatButton label="GET STARTED"
            onClick={() => { this.props.onClick() }} />
        </Footer>
      </Container>
    )
  }
}
