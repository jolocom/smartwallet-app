import React from 'react'
import {theme} from 'styles'
import { RaisedButton, FlatButton } from 'material-ui'
import {Block} from '../../../structure'
import ReactStripeCheckout from 'react-stripe-checkout'
import * as settings from 'settings'

const STYLES = {
  container: {
    margin: '16px'
  },
  info: theme.textStyles.sectionheader,
  infoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: '10px',
    marginRight: '8px'
  },
  avatar: {
    height: '60px',
    width: '60px',
    left: 0,
    top: '20%',
    backgroundColor: '#f3f3f3',
    backgroundPosition: 'center'
  },
  infoHeadline: {
    fontSize: theme.textStyles.subheadline.fontSize,
    color: theme.textStyles.subheadline.color,
    fontWeight: theme.textStyles.subheadline.fontWeight,
    margin: '0px 18px 18px 0px'
  },
  accessMsgHeader: theme.textStyles.sectionheader,
  accessContainer: {
    padding: '0px 0px 18px 52px'
  },
  buttons: {
    width: '70%'
  },
  loading: {
    marginTop: '100px'
  },
  header: {
    padding: '12px'
  },
  list: {
    marginBottom: '20px'
  }
}

export default class EthConnectItem extends React.Component {
  static propTypes = {
    createEthereumIdentity: React.PropTypes.func,
    onToken: React.PropTypes.func,
    ether: React.PropTypes.object,
    confirmDialog: React.PropTypes.func
  }

  connectEthereum() {
    if (this.props.ether.amount !== 0) {
      return (
        <RaisedButton
          secondary
          style={STYLES.buttons}
          onClick={() => { this.props.createEthereumIdentity() }}
          label="CONNECT TO ETHEREUM" />
      )
    } else {
      return (
        <ReactStripeCheckout
          token={(token) => this.props.onToken(token)}
          stripeKey={settings.stripe.publishableKey}
          name="JOLOCOM SMARTWALLET"
          description="Add Ether to your Smart Wallet."
          image="/img/logo.png"
          panelLabel="Bezahlen">
          <RaisedButton
            secondary
            style={STYLES.buttons}
            label="CONNECT TO ETHEREUM" />
        </ReactStripeCheckout>
      )
    }
  }

  render() {
    const whyPopupBody = (
      <div>
        <div>
          To fully use the services of your SmartWallet you need to get your
          data verified which means that there is a double check from our sides
          if it is correct and then the fact that it is correct is stated on the
          <span style={{color: theme.palette.accent1Color}}
            onClick={() => this.props.confirmDialog(infoPopup)}> blockchain
          </span>
        </div><br />
        <div>
          With this technology your data is securely locked. We never store your
          data anywhere. This way only you have access to it, but you can grant
          or withdraw access to it any time.
        </div><br />
        <div>
          The verification process needs ti be done only once and then you can
          use the data at any other service.
        </div><br />
        <div style={STYLES.accessMsgHeader}>Costs</div><br />
        <div>Securely locking the data creates transaction costs. Each
        transaction costs XXX Ether. With signing up for Ethereum you also need
        to buy some ether.</div>
      </div>
    )
    const whyPopup = {
      title: 'Why Ethereum?',
      message: whyPopupBody,
      rightButtonLabel: 'ALL RIGHT',
      callback: () => {},
      leftButtonLabel: 'MORE INFO'
    }
    const infoPopupBody = (
      <div>
        <div>
          A blockchain is a distributed database where integrity (security
          from manipulation) is given by a timestamp and a link to the previous
          data set. These days it is used for cryptocurrency, which means
          that it is as secure as your bank account.
        </div><br />
        <div>
          We use this technology to lock your data. So only you have access
          to it.
        </div>
      </div>
    )
    const infoPopup = {
      title: 'What is a blockchain?',
      message: infoPopupBody,
      rightButtonLabel: 'ALL RIGHT',
      callback: () => {},
      leftButtonLabel: 'MORE INFO'
    }
    const infoHeadline = (
      <div>
      To verify your data, lock it and grant or withdraw
      access to it, you need to connect your SmartWallet to
        a <span style={{color: theme.palette.accent1Color,
          fontWeight: '300'}}
          onClick={() => this.props.confirmDialog(infoPopup)}>
        blockchain</span> called Ethereum. The locking
      of your data costs Ether which is the currency used
      for transactions on the blockchain.
      </div>
    )

    return (
      <div>
        <Block style={STYLES.accessContainer}>
          <div style={STYLES.infoHeadline}>{infoHeadline}</div>
          {this.connectEthereum()}
          <FlatButton
            onClick={() =>
            this.props.confirmDialog(whyPopup)}>
            WHY?
          </FlatButton>
        </Block>
      </div>
    )
  }
}
