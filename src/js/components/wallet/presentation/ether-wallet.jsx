import React from 'react'
import Radium from 'radium'

import {Content, Block} from '../../structure'

import {
  TabContainer,
  HalfScreenContainer
} from './ui'

const STYLES = {
  walletContainer: {
    paddingTop: '24px'
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
              ETHER MGMT
            </Block>
          </Content>
        </HalfScreenContainer>
      </TabContainer>
    )
  }
}
