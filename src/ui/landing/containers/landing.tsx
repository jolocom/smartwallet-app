import React, { useState } from 'react'
import { connect } from 'react-redux'
import { LandingComponent } from 'src/ui/landing/components/landing'
import { navigationActions } from 'src/actions/'
import { ThunkDispatch } from 'src/store'
import { StatusBar } from 'react-native'
import { routeList } from '../../../routeList'
import { withInternet } from '../../../actions/modifiers'
import { useNetInfo } from '@react-native-community/netinfo'

interface Props extends ReturnType<typeof mapDispatchToProps> {}

export const LandingContainer = (props: Props): JSX.Element => {
  const isOnline = useNetInfo().isConnected
  const [wasPressed, setPressed] = useState(false)

  return (
    <React.Fragment>
      <StatusBar barStyle="light-content" />
      <LandingComponent
        isOffline={wasPressed && !isOnline}
        handleGetStarted={() => {
          setPressed(true)
          props.getStarted()
        }}
        handleRecover={() => {
          setPressed(true)
          props.recoverIdentity()
        }}
      />
    </React.Fragment>
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  getStarted: () =>
    dispatch(
      withInternet(
        navigationActions.navigate({
          routeName: routeList.Entropy,
        }),
      ),
    ),
  recoverIdentity: () =>
    dispatch(
      withInternet(
        navigationActions.navigate({
          routeName: routeList.InputSeedPhrase,
        }),
      ),
    ),
})

export const Landing = connect(
  null,
  mapDispatchToProps,
)(LandingContainer)
