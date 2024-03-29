import React from 'react'
import {
  NavigationContainer,
  NavigationContainerRef,
  Theme,
} from '@react-navigation/native'
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import { useSelector } from 'react-redux'

import LoggedOut from '~/screens/LoggedOut'
import { ScreenNames } from '~/types/screens'

import { isLogged } from './modules/account/selectors'
import LoggedIn from './screens/LoggedIn'
import { Colors } from './utils/colors'
import { screenDisableGestures } from './utils/screenSettings'
import GlobalModals from './screens/Globals'

export type RootStackParamList = {
  [ScreenNames.DragToConfirm]: {
    title: string
    cancelText: string
    instructionText: string
    onComplete: () => void
  }
  [ScreenNames.LoggedIn]: undefined
  [ScreenNames.LoggedOut]: undefined
  [ScreenNames.LostSeedPhraseInfo]: undefined
  [ScreenNames.GlobalModals]: undefined
}

const RootStack = createStackNavigator<RootStackParamList>()
const navigationTheme: Theme = {
  dark: true,
  colors: {
    primary: Colors.mainBlack,
    background: Colors.mainBlack,
    card: Colors.mainBlack,
    // NOTE: the values below are not used, but are required due to TS
    text: Colors.white,
    border: Colors.mainBlack,
    notification: Colors.mainBlack,
  },
}

const RootNavigation = React.forwardRef<NavigationContainerRef>((_, ref) => {
  const isLoggedIn = useSelector(isLogged)

  return (
    <NavigationContainer theme={navigationTheme} ref={ref}>
      <RootStack.Navigator headerMode="none" mode="modal">
        {isLoggedIn ? (
          <RootStack.Screen
            name={ScreenNames.LoggedIn}
            component={LoggedIn}
            options={{
              gestureEnabled: false,
            }}
          />
        ) : (
          <RootStack.Screen
            name={ScreenNames.LoggedOut}
            component={LoggedOut}
          />
        )}
        <RootStack.Screen
          name={ScreenNames.GlobalModals}
          component={GlobalModals}
          options={{
            cardStyle: {
              backgroundColor: 'transparent',
            },
            cardStyleInterpolator:
              CardStyleInterpolators.forFadeFromBottomAndroid,
            ...screenDisableGestures,
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  )
})

export default RootNavigation
