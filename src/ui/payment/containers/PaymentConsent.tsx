import React from 'react'
import { connect } from 'react-redux'
import { PaymentConsentComponent } from '../components/PaymentConsent'
import { RootState } from 'src/reducers'
import { cancelSSO } from 'src/actions/sso'
import { sendPaymentResponse } from 'src/actions/sso/paymentRequest'
import { ThunkDispatch } from 'src/store'

interface Props extends ReturnType<typeof mapDispatchToProps>, ReturnType<typeof mapStateToProps> {}

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

const mapStateToProps = (state: RootState) => ({
  activePaymentRequest: state.sso.activePaymentRequest,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  confirmPaymentRequest: () => dispatch(sendPaymentResponse),
  cancelPaymentRequest: () => dispatch(cancelSSO),
})

export const PaymentConsent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentConsentContainer)
