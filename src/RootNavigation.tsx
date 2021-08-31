import React from 'react'
import {
  NavigationContainer,
  NavigationContainerRef,
  Theme,
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useSelector } from 'react-redux'

import LoggedOut from '~/screens/LoggedOut'
import { ScreenNames } from '~/types/screens'

import { isLogged } from './modules/account/selectors'
import LostSeedPhraseInfo from './screens/Modals/LostSeedPhraseInfo'
import LoggedIn from './screens/LoggedIn'
import { Colors } from './utils/colors'
import SeedPhraseInfo from './screens/LoggedOut/Onboarding/Registration/SeedPhrase/SeedPhraseInfo'
import {
  screenDisableGestures,
  screenTransitionSlideFromBottom,
  transparentModalOptions,
} from './utils/screenSettings'
import AppDisabled from './screens/Modals/AppDisabled'

export type RootStackParamList = {
  [ScreenNames.DragToConfirm]: {
    title: string
    cancelText: string
    instructionText: string
    onComplete: () => Promise<void>
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

export type GlobalModalsParamsList = {
  [ScreenNames.LostSeedPhraseInfo]: undefined
  [ScreenNames.SeedPhraseInfo]: undefined
  [ScreenNames.AppDisabled]: {
    attemptCyclesLeft: number
    countdown: number
  }
}

const ModalStack = createStackNavigator()

const GlobalModals = () => {
  return (
    <ModalStack.Navigator
      headerMode="none"
      mode="modal"
      screenOptions={transparentModalOptions}
    >
      <ModalStack.Screen
        name={ScreenNames.LostSeedPhraseInfo}
        component={LostSeedPhraseInfo}
      />
      <ModalStack.Screen
        name={ScreenNames.SeedPhraseInfo}
        component={SeedPhraseInfo}
      />
      <ModalStack.Screen
        name={ScreenNames.AppDisabled}
        component={AppDisabled}
      />
    </ModalStack.Navigator>
  )
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
          name={ScreenNames.GlobalModals}
          component={GlobalModals}
          options={{
            cardStyle: {
              backgroundColor: 'transparent',
            },
            ...screenTransitionSlideFromBottom,
            ...screenDisableGestures,
          }}
        />
        {/* Global -> End */}
      </RootStack.Navigator>
    </NavigationContainer>
  )
})

export default RootNavigation
