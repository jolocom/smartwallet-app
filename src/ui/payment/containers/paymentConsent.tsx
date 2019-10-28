import React from 'react'
import { connect } from 'react-redux'
import { cancelSSO, InteractionTokenSender } from 'src/actions/sso'
import { sendFundsAndAssemblePaymentResponse } from 'src/actions/sso/paymentRequest'
import { ThunkDispatch } from 'src/store'
import { withErrorScreen } from 'src/actions/modifiers'
import { PaymentRequestSummary } from '../../../actions/sso/types'
import { PaymentConsentComponent } from '../components/paymentConsent'
import { withInteractionRequestValidation } from '../../generic/consentWithSummaryHOC'

interface Props extends ReturnType<typeof mapDispatchToProps> {
  interactionDetails: PaymentRequestSummary
  sendResponse: InteractionTokenSender
}

export const PaymentConsentContainer = (props: Props) => {
  const {
    interactionDetails,
    confirmPaymentRequest,
    cancelPaymentRequest,
    sendResponse,
  } = props
  return (
    <PaymentConsentComponent
      paymentDetails={interactionDetails}
      confirmPaymentRequest={() =>
        confirmPaymentRequest(interactionDetails, sendResponse)
      }
      cancelPaymentRequest={cancelPaymentRequest}
    />
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  confirmPaymentRequest: (
    paymentDetails: PaymentRequestSummary,
    sendResponse: InteractionTokenSender,
  ) =>
    dispatch(
      withErrorScreen(
        async (dispatch, getState, { identityWallet, keyChainLib }) =>
          sendResponse(
            await sendFundsAndAssemblePaymentResponse(
              paymentDetails,
              identityWallet,
              await keyChainLib.getPassword(),
            ),
          ),
      ),
    ),
  cancelPaymentRequest: () => dispatch(cancelSSO),
})

export const PaymentConsent = withInteractionRequestValidation(
  connect(
    null,
    mapDispatchToProps,
  )(PaymentConsentContainer),
)
