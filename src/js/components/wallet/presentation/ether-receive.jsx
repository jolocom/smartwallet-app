import React from 'react'
import Radium from 'radium'
import QRCode from 'qrcode.react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Divider from 'material-ui/Divider'
import {List, ListItem} from 'material-ui/List'
import FlatButton from 'material-ui/FlatButton'
import NavigationArrowDown from 'material-ui/svg-icons/navigation/arrow-downward' // eslint-disable-line max-len

import { EtherBalance, TabContainer, HalfScreenContainer } from './ui'
import { Block } from '../../structure'
import { Loading, Error } from '../../common'

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
    money: React.PropTypes.object,
    etherBalance: React.PropTypes.number.isRequired,
    wallet: React.PropTypes.object
  }

  render() {
    const {walletAddress, loading: moneyLoading} = this.props.money
    const {loading: walletLoading, errorMsg} = this.props.wallet
    const loading = moneyLoading || walletLoading

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
          amount={this.props.etherBalance}
          currency="eth"
          currencyPrice={this.props.money.ether.price} />
        <HalfScreenContainer>
          {content}
        </HalfScreenContainer>
      </TabContainer>
    )
  }
}
