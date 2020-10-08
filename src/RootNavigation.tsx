import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import LoggedOut from '~/screens/LoggedOut'
import DeviceAuthentication from './screens/DeviceAuthentication'
import LoggedIn from '~/screens/LoggedIn'
import Interactions from '~/screens/Modals/Interactions'
import SettingsList from '~/screens/SettingsList'

import { ScreenNames } from '~/types/screens'

import { isLogged } from './modules/account/selectors'
import { useSelector } from 'react-redux'
import Lock from './modals/Lock'
import PinRecoveryInstructions from './screens/Modals/PinRecoveryInstructions'
import Recovery from './screens/LoggedOut/Recovery'

const RootStack = createStackNavigator()

const RootNavigation: React.FC = () => {
  const isLoggedIn = useSelector(isLogged)

  return (
    <NavigationContainer>
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
          name={ScreenNames.SettingsList}
          component={SettingsList}
        />
        {/* Modals -> Start */}
        <RootStack.Screen name={ScreenNames.Recovery} component={Recovery} />
        <RootStack.Screen
          name={ScreenNames.Interactions}
          component={Interactions}
        />
        <RootStack.Screen
          name={ScreenNames.DeviceAuth}
          component={DeviceAuthentication}
        />
        <RootStack.Screen
          name={ScreenNames.Lock}
          component={Lock}
          options={{ gestureEnabled: false }}
        />
        <RootStack.Screen
          name={ScreenNames.PinRecoveryInstructions}
          component={PinRecoveryInstructions}
        />
        {/* Modals -> End */}
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default RootNavigation
