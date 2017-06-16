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
    goToEtherManagement: React.PropTypes.func.isRequired
  }

  goToEtherManagement() {
    console.log('ether mgmt')
  }

  render() {
    let {goToEtherManagement} = this.props
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
                amount={3.00}
                currency="eth"
                goToManagement={goToEtherManagement}
                currencyPrice={250}
              />
            </Block>
          </Content>
        </HalfScreenContainer>
      </TabContainer>
    )
  }
}
