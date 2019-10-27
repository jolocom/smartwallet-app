import React from 'react'
import { connect } from 'react-redux'
import { cancelSSO } from 'src/actions/sso'
import { prepareAndSendPaymentResponse } from 'src/actions/sso/paymentRequest'
import { ThunkDispatch } from 'src/store'
import { withErrorScreen } from 'src/actions/modifiers'
import { PaymentRequestSummary } from '../../../actions/sso/types'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { PaymentConsentComponent } from '../components/paymentConsent'
import { withConsentSummary } from '../../generic/consentWithSummaryHOC'

interface PaymentNavigationParams {
  isDeepLinkInteraction: boolean
  jwt: string
}
interface Props extends ReturnType<typeof mapDispatchToProps> {
  navigation: NavigationScreenProp<NavigationState, PaymentNavigationParams>
  interactionDetails: PaymentRequestSummary
}

export const PaymentConsentContainer = (props: Props) => {
  const {
    interactionDetails,
    confirmPaymentRequest,
    cancelPaymentRequest,
    navigation: {
      state: {
        params: { isDeepLinkInteraction },
      },
    },
  } = props
  return (
    <PaymentConsentComponent
      paymentDetails={interactionDetails}
      confirmPaymentRequest={() =>
        confirmPaymentRequest(isDeepLinkInteraction, interactionDetails)
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
        prepareAndSendPaymentResponse(isDeepLinkInteraction, paymentDetails),
      ),
    ),
  cancelPaymentRequest: () => dispatch(cancelSSO),
})

export const PaymentConsent = withConsentSummary(
  connect(
    null,
    mapDispatchToProps,
  )(PaymentConsentContainer),
)
