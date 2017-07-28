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
// import {theme} from 'styles'
import NavigationArrowDown from 'material-ui/svg-icons/navigation/arrow-downward'

const STYLES = {
  qr: {
    marginLeft: '72px',
    marginTop: '8px',
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
    address: React.PropTypes.string
  }

  render() {
    return (
      <TabContainer>
        <EtherBalance
          amount={this.props.ether.ether.amount}
          currency="eth"
          currencyPrice={this.props.ether.ether.price} />
        <HalfScreenContainer>
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
              secondaryText={<p>{this.props.address}</p>}
              primaryText={'Wallet Address'}
              rightIcon={
                <CopyToClipboard text={this.props.address}>
                  <FlatButton>COPY</FlatButton>
                </CopyToClipboard>
              } />
            <Divider
              inset />
          </List>
          <Block style={STYLES.qr}>
            <QRCode
              value={this.props.address}
              size={200}
              fgColor="#4b132b" />
          </Block>
        </HalfScreenContainer>
      </TabContainer>
    )
  }
}
