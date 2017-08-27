import React from 'react'
import Radium from 'radium'
import QRCode from 'qrcode.react'
import CopyToClipboard from 'react-copy-to-clipboard'
import {
  EtherBalance,
  TabContainer,
  HalfScreenContainer
} from './ui'

import {List, Divider, ListItem, FlatButton} from 'material-ui'
import {Block} from '../../structure'
import {Loading, Error} from '../../common'
// import {theme} from 'styles'
import NavigationArrowDown from 'material-ui/svg-icons/navigation/arrow-downward' // eslint-disable-line max-len

const STYLES = {
  qr: {
    marginLeft: '72px',
    marginTop: '8px'
  },
  headItem: {
    width: '100%',
    fontSize: '24px'
  },
  divider: {
    marginLeft: '16px'
  }
}

@Radium
export default class EtherReceive extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    ether: React.PropTypes.object,
    wallet: React.PropTypes.object
  }

  render() {
    const {walletAddress, amount, loading, errorMsg} = this.props.wallet
    let content
    if (loading) {
      content = <Loading />
    } else if (errorMsg) {
      content = <Error message={errorMsg} />
    } else {
      content = (
        <div>
          <List>
            <ListItem
              disabled
              style={STYLES.headItem}
              primaryText={'Receive Ether'} />
            <Divider
              style={STYLES.divider} />
            <ListItem
              disabled
              leftIcon={<NavigationArrowDown color={'#b3c90f'} />}
              insetChildren
              secondaryText={<p>{walletAddress}</p>}
              primaryText={'Wallet Address'}
              rightIcon={
                <CopyToClipboard text={walletAddress}>
                  <FlatButton>COPY</FlatButton>
                </CopyToClipboard>
              } />
            <Divider
              inset />
          </List>
          <Block style={STYLES.qr}>
            <QRCode
              value={walletAddress}
              size={200}
              fgColor="#4b132b" />
          </Block>
        </div>
      )
    }
    return (
      <TabContainer>
        <EtherBalance
          amount={amount}
          currency="eth"
          currencyPrice={this.props.ether.ether.price} />
        <HalfScreenContainer>
          {content}
        </HalfScreenContainer>
      </TabContainer>
    )
  }
}
