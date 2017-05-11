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
  sideNote: {
    padding: '10px',
    lineHeight: '150%'
  },
  flatButton: {
    color: '#953052'
  },
  greeting: {
    fontSize: '20px',
    color: theme.palette.textColor,
    fontWeight: 'normal'
  },
  walletContainer: {
    backgroundColor: 'none',
    padding: '24px',
    paddingBottom: '0px'
  },
  homeImg: {
    maxWidth: '60vw'
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
        <Block>
          <img src="/img/illu_wallet.svg" style={STYLES.homeImg} />
        </Block>
        <Block>
          <h1 style={STYLES.greeting}>Hi {this.props.username}</h1>
        </Block>
        <Block>
          <SideNote style={STYLES.sideNote}>
            Get started with adding your data and request verification. You
            only only need to do this once and then you can use it for further
            services
          </SideNote>
        </Block>
        <Footer>
          <FlatButton style={STYLES.flatButton} label="GET STARTED"
            onClick={() => { this.props.onClick() }} />
        </Footer>
      </Container>
    )
  }
}
