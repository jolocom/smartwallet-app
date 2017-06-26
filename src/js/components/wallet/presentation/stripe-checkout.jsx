import React, { Component } from 'react'
import ReactStripeCheckout from 'react-stripe-checkout'
import * as settings from 'settings'

<<<<<<< HEAD
=======
// import {Content, Block, Header, SideNote} from '../../structure'
>>>>>>> 0e752ada063e1389510733e0a77e2718dc2c9da5
import {
  RaisedButton
} from 'material-ui'

export default class StripeCheckout extends Component {

  buyEther = (token) => {
    this.props.buyEther(token)
  }

  render() {
    return (
      <ReactStripeCheckout
<<<<<<< HEAD
        token={this.buyEther.bind(this)}
        stripeKey="pk_test_6pRNASCoBOKtIshFeQd4XMUh"
=======
        token={this.onToken}
        stripeKey={settings.stripe.publishableKey}
>>>>>>> 0e752ada063e1389510733e0a77e2718dc2c9da5
        name="JOLOCOM SMARTWALLET"
        description="Add Ether to your Smart Wallet."
        image="/img/logo.png"
        panelLabel="Bezahlen"
      >
        <RaisedButton
          secondary
          fullWidth
          label="BUY ETHER" />
      </ReactStripeCheckout>
    )
  }
}
