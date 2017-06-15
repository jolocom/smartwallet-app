import React from 'react'
import Radium from 'radium'

import {Content, Block, Header, SideNote} from '../../structure'

import {
  RaisedButton
} from 'material-ui'

import {
  TabContainer,
  HalfScreenContainer
} from './ui'

const STYLES = {
  walletContainer: {
    padding: '24px',
    textAlign: 'center'
  },
  header: {
    margin: '16px 0'
  }
}

@Radium
export default class WalletEther extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  }

  render() {
    return (
      <TabContainer>
        <HalfScreenContainer>
          <Content style={STYLES.walletContainer}>
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
            </Block>
            <Block>
              <RaisedButton
                secondary
                fullWidth
                label="BUY ETHER"
                onClick={() => { console.log('buy ether') }} />
            </Block>
          </Content>
        </HalfScreenContainer>
      </TabContainer>
    )
  }
}
