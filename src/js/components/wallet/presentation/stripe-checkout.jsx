import React, { Component } from 'react'
import ReactStripeCheckout from 'react-stripe-checkout'
import * as settings from 'settings'

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
        token={this.buyEther.bind(this)}
        stripeKey="pk_test_6pRNASCoBOKtIshFeQd4XMUh"
        token={this.onToken}
        stripeKey={settings.stripe.publishableKey}
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
