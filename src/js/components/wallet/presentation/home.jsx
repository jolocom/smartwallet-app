import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'
import {
  Container,
  Block,
  Footer,
  SideNote
} from '../../structure'
import {theme} from 'styles'

import FlatButton from 'material-ui/FlatButton'

const STYLES = {
  sideNote: {
    lineHeight: '150%'
  },
  flatButton: {
    color: '#953052'
  },
  greeting: {
    fontSize: theme.textStyles.headline.fontSize,
    fontWeight: theme.textStyles.screenHeader.fontWeight,
    color: theme.textStyles.screenHeader.color
  },
  walletContainer: {
    backgroundColor: '#fff',
    padding: '24px 24px 0 24px'
  }
  // homeImg: {
  //   width: '50vw',
  //   maxHeight: '400px'
  // }
}

@Radium
export default class WalletHome extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired
  }

  render() {
    return (
      <Container style={STYLES.walletContainer}>
        {/* <Block>
          <img src="/img/illustration_wallet.svg" style={STYLES.homeImg} />
        </Block> */}
        <Block>
          <h1 style={STYLES.greeting}>Hi, {this.props.username}</h1>
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
