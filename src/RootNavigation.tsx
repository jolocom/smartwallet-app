import React from 'react'
import {
  NavigationContainer,
  NavigationContainerRef,
  Theme,
} from '@react-navigation/native'
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
import { useSelector } from 'react-redux'

import LoggedOut from '~/screens/LoggedOut'
import { ScreenNames } from '~/types/screens'

import { isLogged } from './modules/account/selectors'
import LostSeedPhraseInfo from './screens/Modals/LostSeedPhraseInfo'
import LoggedIn from './screens/LoggedIn'
import { Colors } from './utils/colors'

export type RootStackParamList = {
  [ScreenNames.DragToConfirm]: {
    title: string
    cancelText: string
    onComplete: () => void
  }
  [ScreenNames.LoggedIn]: undefined
  [ScreenNames.LoggedOut]: undefined
  [ScreenNames.LostSeedPhraseInfo]: undefined
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

        {/* Global -> Start */}
        <RootStack.Screen
          name={ScreenNames.LostSeedPhraseInfo}
          component={LostSeedPhraseInfo}
          options={{ ...TransitionPresets.SlideFromRightIOS }}
        />
        {/* Global -> End */}
      </RootStack.Navigator>
    </NavigationContainer>
  )
})

export default RootNavigation
