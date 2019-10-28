import React, { useEffect, useState } from 'react'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { ThunkDispatch } from '../../store'
import { withErrorScreen, withLoading } from '../../actions/modifiers'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  cancelSSO,
  consumeInteractionRequest,
  InteractionTokenSender,
} from '../../actions/sso'
import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { RequestSummary } from '../../utils/interactionRequests/types'

interface PaymentNavigationParams {
  jwt: string
  send: InteractionTokenSender
}

interface Props extends ReturnType<typeof mapDispatchToProps> {
  navigation: NavigationScreenProp<NavigationState, PaymentNavigationParams>
}

interface ConsentContainerProps<T extends RequestSummary> {
  interactionRequest: T
  sendResponse: (interactionToken: JSONWebToken<JWTEncodable>) => Promise<void>
}

const ConsentWithSummaryHOC = <T extends RequestSummary>(
  ConsentContainer: React.ComponentClass<ConsentContainerProps<T>>,
) => (props: Props) => {
  const { jwt } = props.navigation.state.params
  const [parsedInteractionToken, setParsedInteractionToken] = useState<T>()

  useEffect(() => {
    props.consumeInteractionRequest(jwt).then((summary: T) => {
      setParsedInteractionToken(summary)
    })
  }, [])

  return parsedInteractionToken ? (
    <ConsentContainer
      interactionRequest={parsedInteractionToken}
      sendResponse={(token: JSONWebToken<JWTEncodable>) =>
        props.sendInteractionToken(token, props.navigation.state.params.send)
      }
    />
  ) : null
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  sendInteractionToken: async (
    token: JSONWebToken<JWTEncodable>,
    send: InteractionTokenSender,
  ) => send(token).finally(() => dispatch(cancelSSO())),
  consumeInteractionRequest: (jwt: string) =>
    dispatch(withErrorScreen(withLoading(consumeInteractionRequest(jwt)))),
})

export const withInteractionRequestValidation = compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  ConsentWithSummaryHOC,
)
