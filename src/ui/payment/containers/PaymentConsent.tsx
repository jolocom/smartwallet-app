import React from 'react'
import { connect } from 'react-redux'
import { PaymentConsentComponent } from '../components/PaymentConsent'
import { StatePaymentRequestSummary } from 'src/reducers/sso'
import { RootState } from 'src/reducers'
import { cancelSSO } from 'src/actions/sso'
import { sendPaymentResponse } from 'src/actions/sso/paymentRequest'

interface ConnectProps {}

interface Props extends ConnectProps {
  activePaymentRequest: StatePaymentRequestSummary
  confirmPaymentRequest: () => void
  cancelPaymentRequest: () => void
}

interface State {}

export class PaymentConsentContainer extends React.Component<Props, State> {
  render() {
    return (
      <PaymentConsentComponent
        activePaymentRequest={this.props.activePaymentRequest}
        confirmPaymentRequest={this.props.confirmPaymentRequest}
        cancelPaymentRequest={this.props.cancelPaymentRequest}
      />
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    activePaymentRequest: state.sso.activePaymentRequest
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    confirmPaymentRequest: () => dispatch(sendPaymentResponse()),
    cancelPaymentRequest: () => dispatch(cancelSSO())
  }
}

export const PaymentConsent = connect(mapStateToProps, mapDispatchToProps)(PaymentConsentContainer)
