import React, { Component } from 'react'
import ReactStripeCheckout from 'react-stripe-checkout'

import {Content, Block, Header, SideNote} from '../../structure'
import {
  RaisedButton
} from 'material-ui'

export default class StripeCheckout extends Component {

  onToken = (token) => {
    // fetch('/save-stripe-token', {
    //   method: 'POST',
    //   body: token
    // }).then(response => {
    //   response.then(data => {
    //    TODO
    //   })
    // })
  }

  render() {
    return(
      <ReactStripeCheckout
        token={this.onToken}
        stripeKey="pk_test_6pRNASCoBOKtIshFeQd4XMUh"
        name="JOLOCOM SMARTWALLET"
        description="Add Ether to your Smart Wallet."
        image="/img/logo.png"
        panelLabel="Bezahlen"
        >
        <RaisedButton
          secondary
           fullWidth
           label="BUY ETHER">
        </RaisedButton>
      </ReactStripeCheckout>
    )
  }
}
