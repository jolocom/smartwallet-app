import React from 'react'
import { connect } from 'react-redux'
import { PaymentConsentComponent } from '../components/PaymentConsent'
import { StatePaymentRequestSummary } from 'src/reducers/sso';
import { RootState } from 'src/reducers';

interface ConnectProps {}

interface Props extends ConnectProps {
  activePaymentRequest: StatePaymentRequestSummary
  confirmPaymentRequest: () => void
  cancelPaymentRequest: () => void
}

interface State {}

const dummyConfirmPaymentRequest = () => console.log('Payment confirmed.')
const dummyCancelPaymentRequest = () => console.log('Payment cancelled.')

export class PaymentConsentContainer extends React.Component<Props, State> {
  render() {
    return (
      <PaymentConsentComponent
        activePaymentRequest={this.props.activePaymentRequest}
        confirmPaymentRequest={dummyConfirmPaymentRequest}
        cancelPaymentRequest={dummyCancelPaymentRequest}
      />
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    activePaymentRequest: state.sso.activePaymentRequest
  }
}

// const mapDispatchToProps = (dispatch: Function) => {
//   return {
//     confirmPaymentRequest: () => dispatch(paymentActions.sendDemoPaymentResponse()),
//     cancelPaymentRequest: () => dispatch(paymentActions.cancelPaymentRequest())
//   }
// }

export const PaymentConsent = connect(mapStateToProps, {})(PaymentConsentContainer)
