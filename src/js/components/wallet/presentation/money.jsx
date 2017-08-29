import React from 'react'
import Radium from 'radium'

import {Content, Block} from '../../structure'
import {Loading, Error} from '../../common'

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
    buyEther: React.PropTypes.func.isRequired,
    goToEtherManagement: React.PropTypes.func.isRequired
  }

  render() {
    const {goToEtherManagement, ether} = this.props
    let content
    if (!ether.loaded) {
      content = <Loading />
    } else if (ether.errorMsg) {
      content = (
        <Error message={ether.errorMsg} />
      )
    } else {
      content = (
        <div>
          <Block>
            <PlusMenu
              name="Digital Currency"
              goToManagement={() => goToEtherManagement('etherBuyingScreen')}
            />
          </Block>
          <Block>
            <PlusSubMenu
              amount={ether.amount}
              currency="eth"
              ethSvg={{fill: '#4b132b'}}
              goToManagement={() => goToEtherManagement('etherManagement')}
              currencyPrice={ether.price} />
          </Block>
        </div>
      )
    }
    return (
      <TabContainer>
        <HalfScreenContainer>
          <Content style={STYLES.walletContainer}>
            {content}
          </Content>
        </HalfScreenContainer>
      </TabContainer>
    )
  }
}
