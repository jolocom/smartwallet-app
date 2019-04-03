import React from 'react'
import { connect } from 'react-redux'
import { PaymentConsentComponent } from '../components/PaymentConsent'

// interface ConnectProps {}

// interface Props extends ConnectProps {
//   confirmPaymentRequest: () => void
//   cancelPaymentRequest: () => void
// }

interface State {}

const dummyTransactionDetails = {
  description: 'Payment for monthly subscription to awesome service',
  transactionOptions: {
    value: 0.5e18, // 0.5 Ether in Wei
    to: '0x10ed0857fd6d752f2089a6b0d3fe7f0392e046e0'
  }
}

const dummyConfirmPaymentRequest = () => console.log('Payment confirmed.')
const dummyCancelPaymentRequest = () => console.log('Payment cancelled.')

export class PaymentConsentContainer extends React.Component<State> {
  render() {
    return (
      <PaymentConsentComponent
        transactionDetails={dummyTransactionDetails}
        confirmPaymentRequest={dummyConfirmPaymentRequest}
        cancelPaymentRequest={dummyCancelPaymentRequest}
      />
    )
  }
}

// const mapStateToProps = (state: any) => {
//   return {
//     activePaymentRequest: state.payment.activePaymentRequest
//   }
// }
// const mapStateToProps = (state: any) => {
//   return {}
// }

// const mapDispatchToProps = (dispatch: Function) => {
//   return {
//     confirmPaymentRequest: () => dispatch(paymentActions.sendDemoPaymentResponse()),
//     cancelPaymentRequest: () => dispatch(paymentActions.cancelPaymentRequest())
//   }
// }

export const PaymentConsent = connect()(PaymentConsentContainer)
