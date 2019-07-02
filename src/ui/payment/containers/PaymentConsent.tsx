import React from 'react'
import { connect } from 'react-redux'
import { PaymentConsentComponent } from '../components/PaymentConsent'
import { RootState } from 'src/reducers'
import { cancelSSO } from 'src/actions/sso'
import { sendPaymentResponse } from 'src/actions/sso/paymentRequest'
import { ThunkDispatch } from 'src/store'
import { NavigationParams } from 'react-navigation'
import { withErrorHandling } from '../../../actions/modifiers'
import { showErrorScreen } from '../../../actions/generic'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {
  navigation: { state: { params: NavigationParams } }
}

interface State {}

export class PaymentConsentContainer extends React.Component<Props, State> {
  render() {
    const { isDeepLinkInteraction } = this.props.navigation.state.params
    return (
      <PaymentConsentComponent
        activePaymentRequest={this.props.activePaymentRequest}
        confirmPaymentRequest={() =>
          this.props.confirmPaymentRequest(isDeepLinkInteraction)
        }
        cancelPaymentRequest={this.props.cancelPaymentRequest}
      />
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  activePaymentRequest: state.sso.activePaymentRequest,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  confirmPaymentRequest: (isDeepLinkInteraction: boolean) =>
    dispatch(
      withErrorHandling(showErrorScreen)(
        sendPaymentResponse(isDeepLinkInteraction),
      ),
    ),
  cancelPaymentRequest: () => dispatch(cancelSSO),
})

export const PaymentConsent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentConsentContainer)
