import React from 'react'
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useSelector } from 'react-redux'

import LoggedOut from '~/screens/LoggedOut'
import { ScreenNames } from '~/types/screens'

import { isLogged } from './modules/account/selectors'
import LostSeedPhraseInfo from './screens/Modals/LostSeedPhraseInfo'
import BeforeLoggedIn from './screens/BeforeLoggedIn'

export type RootStackParamList = {
  [ScreenNames.DragToConfirm]: {
    title: string
    cancelText: string
    onComplete: () => void
  }
  [ScreenNames.BeforeLoggedIn]: undefined
  [ScreenNames.LoggedOut]: undefined
  [ScreenNames.LostSeedPhraseInfo]: undefined
}

const RootStack = createStackNavigator<RootStackParamList>()

const RootNavigation = React.forwardRef<NavigationContainerRef>((_, ref) => {
  const isLoggedIn = useSelector(isLogged)

  return (
    <NavigationContainer ref={ref}>
      <RootStack.Navigator headerMode="none" mode="modal">
        {isLoggedIn ? (
          <RootStack.Screen
            name={ScreenNames.BeforeLoggedIn}
            component={BeforeLoggedIn}
            options={{ gestureEnabled: false }}
          />
        ) : (
          <RootStack.Screen
            name={ScreenNames.LoggedOut}
            component={LoggedOut}
          />
        )}

        {/* Global -> Start */}
        <RootStack.Screen
          name={ScreenNames.LostSeedPhraseInfo}
          component={LostSeedPhraseInfo}
        />
        {/* Global -> End */}
      </RootStack.Navigator>
    </NavigationContainer>
  )
})

export default RootNavigation
