import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { cancelSSO } from 'src/actions/sso'
import { sendPaymentResponse } from 'src/actions/sso/paymentRequest'
import { ThunkDispatch } from 'src/store'
import { withErrorScreen } from 'src/actions/modifiers'
import { PaymentRequestSummary } from '../../../actions/sso/types'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { handleDeepLink } from '../../../actions/navigation'
import { JolocomLib } from 'jolocom-lib'
import { interactionHandlers } from '../../../lib/storage/interactionTokens'
import { PaymentConsentComponent } from '../components/paymentConsent'

interface PaymentNavigationParams {
  isDeepLinkInteraction: boolean
  paymentDetails: PaymentRequestSummary
}
interface Props extends ReturnType<typeof mapDispatchToProps> {
  navigation: NavigationScreenProp<NavigationState, PaymentNavigationParams>
}

export const TestWrapperContainer = <T extends Props>(
  ToWrap: React.ComponentClass<T>,
) => (props: T) => {
  const [isDone, setDone] = useState(false)
  const [parsedToken, setParsedToken] = useState()

  useEffect(() => {
    const interactionToken = JolocomLib.parse.interactionToken.fromJWT(
      props.navigation.state.params.jwt,
    )
    const handler = interactionHandlers[interactionToken.interactionType]
    setParsedToken(handler(interactionToken))
    setDone(true)
  }, [])

  return isDone && <ToWrap {...props} interactionDetails={parsedToken} />
}

interface TempProps<T> extends Props {
  interactionDetails: T
}

export const PaymentConsentContainer = (
  props: TempProps<PaymentRequestSummary>,
) => {
  const {
    interactionDetails,
    confirmPaymentRequest,
    cancelPaymentRequest,
    navigation: {
      state: {
        params: { jwt },
      },
    },
  } = props
  props.test(jwt)
  return (
    <PaymentConsentComponent
      paymentDetails={interactionDetails}
      confirmPaymentRequest={() =>
        confirmPaymentRequest(true, interactionDetails)
      }
      cancelPaymentRequest={cancelPaymentRequest}
    />
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  test: (jwt: string) => {
    dispatch(withErrorScreen(handleDeepLink(jwt)))
  },
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
