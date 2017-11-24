import React, { Component } from 'react'
import ReactStripeCheckout from 'react-stripe-checkout'

import RaisedButton from 'material-ui/RaisedButton'

const STYLES = {
  buyEtherButton: {
    width: '40%'
  }
}
export default class StripeCheckout extends Component {
  static propTypes = {
    onToken: React.PropTypes.func.isRequired
  }

  render() {
    return (
      <ReactStripeCheckout
        token={(token) => this.props.onToken(token)}
        stripeKey={STRIPE_PUB_KEY}
        name="JOLOCOM SMARTWALLET"
        description="Add Ether to your Smart Wallet."
        image="/img/logo.png"
        panelLabel="Bezahlen"
      >
        <RaisedButton
          style={STYLES.buyEtherButton}
          secondary
          label="BUY ETHER" />
      </ReactStripeCheckout>
    )
  }
}
