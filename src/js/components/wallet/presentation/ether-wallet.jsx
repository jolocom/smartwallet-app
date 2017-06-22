import React from 'react'
import Radium from 'radium'

import {Content, Block, Header, SideNote} from '../../structure'

import {
  RaisedButton
} from 'material-ui'

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
    children: React.PropTypes.node,
    buyEther: React.PropTypes.func
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
            <Bubbles ethBalance={"0.0215180852"}/>
          </Block>
        </Block>
        <Block>
          <RaisedButton
            secondary
            fullWidth
            label="BUY ETHER"
            onClick={() => { this.props.buyEther() }} />
        </Block>
      </div>
    )
  }

  render() {
    return (
      <TabContainer>
        <HalfScreenContainer>
          <Content>
          {
            this.props.ether.ether.amount
            ? this.renderHasEther()
            : this.renderNoEther()
          }
          </Content>
        </HalfScreenContainer>
      </TabContainer>
    )
  }
}
