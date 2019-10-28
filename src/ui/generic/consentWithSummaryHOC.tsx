import React, { useEffect, useState } from 'react'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { ThunkDispatch } from '../../store'
import { withErrorScreen, withLoading } from '../../actions/modifiers'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { RequestSummary } from '../../actions/sso/types'
import { consumeInteractionRequest } from '../../actions/sso'

interface PaymentNavigationParams {
  jwt: string
}

interface Props extends ReturnType<typeof mapDispatchToProps> {
  navigation: NavigationScreenProp<NavigationState, PaymentNavigationParams>
}

interface ConsentContainerProps<T extends RequestSummary> {
  interactionRequest: T
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
    <ConsentContainer interactionRequest={parsedInteractionToken} />
  ) : null
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
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
