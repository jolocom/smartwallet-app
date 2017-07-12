import React from 'react'
import Radium from 'radium'

import {Content, Block} from '../../structure'

import {
  PlusMenu,
  PlusSubMenu,
  TabContainer,
  HalfScreenContainer
} from './ui'

const STYLES = {
  walletContainer: {
    paddingTop: '24px'
  }
}

@Radium
export default class WalletMoney extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    ether: React.PropTypes.object.isRequired,
    goToEtherManagement: React.PropTypes.func.isRequired
  }

  goToEtherManagement() {
    console.log('ether mgmt')
  }

  render() {
    let {goToEtherManagement, ether} = this.props
    return (
      <TabContainer>
        <HalfScreenContainer>
          <Content style={STYLES.walletContainer}>
            <Block>
              <PlusMenu
                name="Digital Currency"
                goToManagement={goToEtherManagement}
              />
            </Block>
            <Block>
              <PlusSubMenu
                amount={ether.amount}
                currency="eth"
                goToManagement={goToEtherManagement}
                currencyPrice={ether.price}
              />
            </Block>
          </Content>
        </HalfScreenContainer>
      </TabContainer>
    )
  }
}
