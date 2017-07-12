import React, { Component } from 'react'
import ReactStripeCheckout from 'react-stripe-checkout'
import * as settings from 'settings'

import {
  RaisedButton
} from 'material-ui'

export default class StripeCheckout extends Component {
  static propTypes = {
    onToken: React.PropTypes.func.isRequired
  }

  render() {
    return (
      <ReactStripeCheckout
        token={(token) => this.props.onToken(token)}
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
