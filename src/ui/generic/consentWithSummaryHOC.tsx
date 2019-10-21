import React, { useEffect, useState } from 'react'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { ThunkDispatch } from '../../store'
import { withErrorScreen, withLoading } from '../../actions/modifiers'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { consumeInteractionToken } from '../../actions/sso/consumeInteractionToken'

interface PaymentNavigationParams {
  jwt: string
}

interface Props extends ReturnType<typeof mapDispatchToProps> {
  navigation: NavigationScreenProp<NavigationState, PaymentNavigationParams>
}

const ConsentWithSummaryHOC = <T extends Props>(
  ConsentContainer: React.ComponentClass<T>,
) => (props: T) => {
  const [isDone, setDone] = useState(false)
  const [profile, setProfile] = useState()
  const { jwt } = props.navigation.state.params

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props.getSummary(jwt).then((summary: any) => {
      setProfile(summary)
      setDone(true)
    })
  }, [])

  return isDone && <ConsentContainer {...props} interactionDetails={profile} />
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  getSummary: (jwt: string) =>
    dispatch(withErrorScreen(withLoading(consumeInteractionToken(jwt)))),
})

export const withConsentSummary = compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  ConsentWithSummaryHOC,
)
