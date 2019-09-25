import React from 'react'
import { connect } from 'react-redux'
import { PaymentConsentComponent } from '../components/paymentConsent'
import { cancelSSO } from 'src/actions/sso'
import { sendPaymentResponse } from 'src/actions/sso/paymentRequest'
import { ThunkDispatch } from 'src/store'
import { withErrorScreen } from 'src/actions/modifiers'
import { PaymentRequestSummary } from '../../../actions/sso/types'
import { NavigationScreenProp, NavigationState } from 'react-navigation'

interface PaymentNavigationParams {
  isDeepLinkInteraction: boolean
  paymentDetails: PaymentRequestSummary
}
interface Props extends ReturnType<typeof mapDispatchToProps> {
  navigation: NavigationScreenProp<NavigationState, PaymentNavigationParams>
}

export const PaymentConsentContainer = (props: Props) => {
  const {
    confirmPaymentRequest,
    cancelPaymentRequest,
    navigation: {
      state: {
        params: { isDeepLinkInteraction, paymentDetails },
      },
    },
  } = props
  return (
    <PaymentConsentComponent
      paymentDetails={paymentDetails}
      confirmPaymentRequest={() =>
        confirmPaymentRequest(isDeepLinkInteraction, paymentDetails)
      }
      cancelPaymentRequest={cancelPaymentRequest}
    />
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  confirmPaymentRequest: (
    isDeepLinkInteraction: boolean,
    paymentDetails: PaymentRequestSummary,
  ) =>
    dispatch(
      withErrorScreen(
        sendPaymentResponse(isDeepLinkInteraction, paymentDetails),
      ),
    ),
  cancelPaymentRequest: () => dispatch(cancelSSO),
})

export const PaymentConsent = connect(
  null,
  mapDispatchToProps,
)(PaymentConsentContainer)
