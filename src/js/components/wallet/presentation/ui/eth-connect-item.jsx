import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import ReactStripeCheckout from 'react-stripe-checkout'

import {Block} from '../../../structure'
import {theme} from 'styles'

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
    ethereum: React.PropTypes.object,
    confirmDialog: React.PropTypes.func
  }

  connectEthereum() {
    if (this.props.ethereum.amount > 0) {
      return (
        <RaisedButton
          secondary
          style={STYLES.buttons}
          onClick={() => { this.props.createEthereumIdentity() }}
          label="SMART CONTRACT" />
      )
    } else {
      return (
        <ReactStripeCheckout
          token={(token) => this.props.onToken(token)}
          stripeKey={STRIPE_PUB_KEY}
          name="JOLOCOM SMARTWALLET"
          description="Add Ether to your Smart Wallet."
          image="/img/logo.png"
          panelLabel="Bezahlen">
          <RaisedButton
            secondary
            style={STYLES.buttons}
            label="Buy Ether first" />
        </ReactStripeCheckout>
      )
    }
  }

  render() {
    const whyPopupBody = (
      <div>
        <div>
          To fully use the services of your SmartWallet on the
          <span style={{color: theme.palette.accent1Color}}
            onClick={() => this.props.confirmDialog(infoPopup)}> blockchain
          </span>, you
          can create an Identity Address. This is a smart contract which allows
          you to interact with other smart contracts on Ethereum. Initially,
          only
          your public key is stored here. This enables other identities to check
          your statements which you sign with your private key.
        </div><br />
        <div>
          With this technology your data is securely stored in your private
          space but can be checked
          by other people or companies without trusting each other.
          Please note that we never store your original data on the blockchain.
          This way, only you have access to your data, but you can grant
          or withdraw access to it anytime to other parties so that they can
          check the data they need.
        </div><br />
        <div style={STYLES.accessMsgHeader}>Costs</div><br />
        <div>Please note that you need to have some ether to create this
        Identity Address. It will cost you approx. 14 EUR</div>
      </div>
    )
    const whyPopup = {
      title: 'Why Ethereum?',
      message: whyPopupBody,
      rightButtonLabel: 'MORE INFO',
      callback: () => {},
      leftButtonLabel: 'ALL RIGHT'
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
      rightButtonLabel: 'MORE INFO',
      callback: () => {},
      leftButtonLabel: 'ALL RIGHT'
    }
    const infoHeadline = (
      <div>
        To fully use the services of your SmartWallet on
        the <span style={{color: theme.palette.accent1Color,
          fontWeight: '300'}}
          onClick={() => this.props.confirmDialog(infoPopup)}>
        blockchain</span>, you
        can create an Identity Address. This is a smart contract which allows
        you to interact with other smart contracts on Ethereum. You will need
        some ether for this.
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
