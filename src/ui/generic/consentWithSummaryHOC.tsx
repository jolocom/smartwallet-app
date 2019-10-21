import React, { useEffect, useState } from 'react'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { PaymentRequestSummary } from '../../actions/sso/types'
import { ThunkDispatch } from '../../store'
import { withErrorScreen, withLoading } from '../../actions/modifiers'
import { handleDeepLink } from '../../actions/navigation'
import { compose } from 'redux'
import { connect } from 'react-redux'

interface PaymentNavigationParams {
  isDeepLinkInteraction: boolean
  paymentDetails: PaymentRequestSummary
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
    props.getSummary(jwt).then((profile: any) => {
      setProfile(profile)
      setDone(true)
    })
  }, [])

  return isDone && <ConsentContainer {...props} interactionDetails={profile} />
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  getSummary: (jwt: string) => {
    return dispatch(withErrorScreen(withLoading(handleDeepLink(jwt))))
  },
})

export const withDeepLinkSummary = compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  ConsentWithSummaryHOC,
)
