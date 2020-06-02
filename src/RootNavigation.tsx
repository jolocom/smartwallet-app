import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import LoggedOut from '~/screens/LoggedOut'
import LoggedIn from '~/screens/LoggedIn'
import Loader from '~/screens/Modals/Loader'
import Interactions from '~/screens/Modals/Interactions'

import { modalScreenOptions } from '~/utils/styles'
import { ScreenNames } from '~/types/screens'

import { getLoaderState } from '~/modules/loader/selectors'
import { isLogged } from '~/modules/account/selectors'

const RootStack = createStackNavigator()

// a listener for loader module state
const useLoaderScreenVisibility = () => {
  const ref = useRef<NavigationContainerRef>(null)

  const { msg } = useSelector(getLoaderState)

  // as soon as state of loader module changes,
  // 1. if there is a loader msg in state (once setLoader action was dispatched):
  //    navigate to the Loader modal screen

  // [how to use]
  // a. show Loader screen: dispatch(setLoader({type: LoaderTypes, msg: string}));
  useEffect(() => {
    if (ref.current) {
      if (msg) {
        const currentState = ref.current.getRootState()

        const currentRouteName = currentState.routes[currentState.index].name

        // to avoid loader screen to be on top of each other in the stack
        if (currentRouteName !== ScreenNames.Loader) {
          ref.current.navigate(ScreenNames.Loader)
        }
      }
    }
  }, [msg])

  return ref
}

const RootNavigation: React.FC = () => {
  const ref = useLoaderScreenVisibility()
  const isLoggedIn = useSelector(isLogged)

  return (
    <NavigationContainer ref={ref}>
      <RootStack.Navigator headerMode="none" mode="modal">
        {isLoggedIn ? (
          <RootStack.Screen name={ScreenNames.LoggedIn} component={LoggedIn} />
        ) : (
          <RootStack.Screen
            name={ScreenNames.LoggedOut}
            component={LoggedOut}
          />
        )}
        <RootStack.Screen
          name={ScreenNames.Loader}
          component={Loader}
          options={{
            ...modalScreenOptions,
            cardOverlayEnabled: true,
            cardStyle: { backgroundColor: 'transparent' },
          }}
        />
        <RootStack.Screen
          name={ScreenNames.Interactions}
          component={Interactions}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default RootNavigation
