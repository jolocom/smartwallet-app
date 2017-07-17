import React from 'react'
import Radium from 'radium'

import {NavigationArrowBack} from 'material-ui/svg-icons'
import {AppBar} from 'material-ui'
import {Content, Block, Header, SideNote} from '../../structure'
import StripeCheckout from './stripe-checkout'
import Spinner from '../../common/spinner'

import {theme} from 'styles'

import {
  TabContainer,
  HalfScreenContainer,
  PlusSubMenu,
  Bubbles
} from './ui'

const STYLES = {
  noEtherContainer: {
    padding: '24px',
    textAlign: 'center'
  },
  etherContainer: {
    backgroundColor: theme.palette.textColor
  },
  header: {
    margin: '16px 0'
  }
}

@Radium
export default class WalletEther extends React.Component {
  static propTypes = {
    goToWalletScreen: React.PropTypes.func,
    children: React.PropTypes.node,
    onToken: React.PropTypes.func,
    ether: React.PropTypes.object,
    avatar: React.PropTypes.string,
    title: React.PropTypes.string
  }

  renderLoading() {
    const messageWait = ['This might take a while...',
      'Please have some patience...', 'Almost there...']
    return (
      <div style={STYLES.noEtherContainer}>
        <Block>
          <Spinner style={STYLES.header} message={messageWait}
            title={'Thank you. We are transferring some Ether to your Account.'}
            avatar={'url(/img/img_techguy.svg)'} />
        </Block>
      </div>
    )
  }

  renderHasEther() {
    return (
      <div style={STYLES.etherContainer}>
        <Block>
          <PlusSubMenu
            overview
            amount={this.props.ether.ether.amount}
            currency="eth"
            currencyPrice={this.props.ether.ether.price}
          />
        </Block>
      </div>
    )
  }

  renderNoEther() {
    return (
      <div style={STYLES.noEtherContainer}>
        <Block>
          <Header
            style={STYLES.header}
            title="You don't have any Ether yet."
          />
          <SideNote>
            'To store your information securely, it costs Ether. One
             transaction (saving data) is at 30 cents. To use this app
             correctly we suggest you to either buy some Ether here...'
          </SideNote>
          <Block>
            <Bubbles ethBalance={'0.0215180852'} />
          </Block>
        </Block>
        <Block>
          <StripeCheckout onToken={token => {
            this.props.onToken(token)
          }} />
        </Block>
      </div>
    )
  }

  render() {
    let content = null
    if (this.props.ether.ether.buying) {
      content = this.renderLoading()
    } else if (true) {
      content = this.renderHasEther()
    } else if (!this.props.ether.ether.amount) {
      content = this.renderNoEther()
    }

    return (<TabContainer>
      <AppBar
        title="Ethereum Wallet"
        iconElementLeft={
          <NavigationArrowBack style={{margin: '50%'}}
            onClick={this.props.goToWalletScreen} />
        } />
      <HalfScreenContainer>
        <Content>
          {content}
        </Content>
      </HalfScreenContainer>
    </TabContainer>)
  }
}
