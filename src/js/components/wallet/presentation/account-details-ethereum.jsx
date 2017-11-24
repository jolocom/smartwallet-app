import React from 'react'
import Radium from 'radium'
import QRCode from 'qrcode.react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { fade } from 'material-ui/utils/colorManipulator'

import NavigationArrowDown from 'material-ui/svg-icons/navigation/arrow-downward' // eslint-disable-line max-len
import List from 'material-ui/List'
import Divider from 'material-ui/Divider'
import ListItem from 'material-ui/List'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import AppBar from 'material-ui/AppBar'

import { TabContainer, HalfScreenContainer } from './ui'
import { Block, Header, SideNote } from '../../structure'
import { Error } from '../../common'
import { theme } from 'styles'

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
  },
  header: {
    margin: '42px 0 16px 0'
  },
  title: {
    color: theme.palette.alternateTextColor,
    fontSize: theme.textStyles.headline.fontSize,
    fontWeight: theme.textStyles.headline.fontWeight,
    margin: 0
  },
  bar: {
    backgroundColor: theme.palette.primary1Color
  },
  appBarButton: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    margin: 'auto',
    borderRadius: '2px',
    padding: '16px',
    color: '#fff'
  },
  hoverColor: fade('#a4a4a3', 0.55),
  sidenote: {
    margin: '18px 18px 0 0'
  }
}

@Radium
export default class EtherReceive extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    wallet: React.PropTypes.object,
    onClose: React.PropTypes.func
  }

  render() {
    let {walletAddress} = this.props.wallet
    if (walletAddress.length === 0) {
      walletAddress = 'OOOPS...Your address could not be loaded.'
    }
    const {errorMsg} = this.props.wallet.ether

    let content
    if (errorMsg) {
      content = <Error message={errorMsg} />
    } else {
      content = (
        <div>
          <List>
            <Header
              title="This is your Account ID" />
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
            <SideNote style={STYLES.sidenote}>
              You can scan this QRCode to send some ether from a different
              wallet to this wallet.
            </SideNote>
          </Block>
        </div>
      )
    }
    return (
      <div>
        <AppBar
          title="Account Ethereum"
          titleStyle={STYLES.title}
          style={STYLES.bar}
          iconElementLeft={
            <IconButton
              iconStyle={{color: STYLES.appBarButton.color}}
              color={STYLES.appBarButton.color}
              onClick={() => { this.props.onClose() }}
              iconClassName="material-icons">close</IconButton>
          } />
        <TabContainer>
          <HalfScreenContainer>
            {content}
          </HalfScreenContainer>
        </TabContainer>
      </div>
    )
  }
}
