import React from 'react'
import Radium from 'radium'

// import {NavigationArrowBack} from 'material-ui/svg-icons'
import {Divider, List, ListItem, FlatButton} from 'material-ui'
import {Block, Header, SideNote} from '../../structure'
import StripeCheckout from './stripe-checkout'
import {Spinner, Error, Loading} from '../../common'

import {theme} from 'styles'

import {
  TabContainer,
  HalfScreenContainer,
  Bubbles,
  EtherBalance
} from './ui'

const STYLES = {
  noEtherContainer: {
    padding: '24px',
    textAlign: 'center'
  },
  headItem: {
    width: '100%',
    fontSize: '24px'
  },
  header: {
    margin: '16px 0px 16px 0px'
  },
  divider: {
    marginLeft: '16px'
  },
  listItem: {
    padding: '16px 0px 0px 72px'
  },
  getAccountContainer: {
    marginTop: '8px'
  }
}

@Radium
export default class WalletEther extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    onToken: React.PropTypes.func,
    money: React.PropTypes.object,
    etherBalance: React.PropTypes.number.isRequired,
    wallet: React.PropTypes.object,
    goToAccountDetailsEthereum: React.PropTypes.func
  }

  renderLoading() {
    return (
      <HalfScreenContainer>
        <div style={STYLES.noEtherContainer}>
          <Block>
            <Spinner style={STYLES.header} message={''}
              title={'Ether are transferred to your account.'}
              avatar={'url(/img/img_techguy.svg)'} />
          </Block>
        </div>
      </HalfScreenContainer>
    )
  }
  renderWaitingForEther() {
    return (
      <HalfScreenContainer>
        <div style={STYLES.noEtherContainer}>
          <Block>
            <Header
              style={STYLES.header}
              title="Transferring ether will take some time. Please wait here or
              come back later." />
            <Loading />
          </Block>
        </div>
      </HalfScreenContainer>
    )
  }
  renderHasEther() {
    return (
      <HalfScreenContainer>
        <EtherBalance
          amount={this.props.etherBalance}
          currencyPrice={this.props.money.ether.price} />
        <List>
          <ListItem
            disabled
            style={STYLES.headItem}
            primaryText={'Current Transactions'} />
          <Divider
            style={STYLES.divider} />
        </List>
      </HalfScreenContainer>
    )
  }

  renderNoEther() {
    return (
      <HalfScreenContainer>
        <div style={STYLES.noEtherContainer}>
          <Block>
            <Header
              style={STYLES.header}
              title="You don't have any Ether yet." />
            <SideNote>
              You can tap into the Ethereum smart contract world by creating an
              identity address.
              To do this and use this app fully we suggest you to either buy
              some Ether here...
            </SideNote>
            <Block>
              <Bubbles ethBalance={'0.0215180852'} />
            </Block>
          </Block>
          <Block>
            <StripeCheckout onToken={token => {
              this.props.onToken(token)
            }} />
          </Block>
          <Block style={STYLES.getAccountContainer}>
            <SideNote>...or transfer some from a different account.</SideNote>
            <FlatButton
              style={{color: theme.palette.accent1Color}}
              onClick={this.props.goToAccountDetailsEthereum}>
              GET ACCOUNT DETAILS
            </FlatButton>
          </Block>
        </div>
      </HalfScreenContainer>
    )
  }

  render() {
    let content = null
    const {screenToDisplay} = this.props.money
    const {
      buying: buyingEther, loading: moneyLoading, errorMsg: errorMsgMoney, checkingOut // eslint-disable-line max-len
    } = this.props.money.ether
    const { errorMsg, loading: walletLoading } = this.props.wallet
    const loading = moneyLoading || walletLoading
    const errorMessage = errorMsg || errorMsgMoney
    const amount = this.props.etherBalance

    if (loading) {
      content = (<Block><Loading /></Block>)
    } else if (buyingEther) {
      content = this.renderLoading()
    } else if (errorMessage) {
      content = (
        <HalfScreenContainer>
          <Error message={errorMessage} />
        </HalfScreenContainer>)
    } else if (checkingOut) {
      content = this.renderWaitingForEther()
    } else if (amount > 0 && screenToDisplay !== 'etherBuyingScreen') {
      content = this.renderHasEther()
    } else if (!amount || screenToDisplay === 'etherBuyingScreen') {
      content = this.renderNoEther()
    }
    return (
      <TabContainer>
        {content}
      </TabContainer>)
  }
}
