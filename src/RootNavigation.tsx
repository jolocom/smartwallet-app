import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useSelector } from 'react-redux'

import LoggedOut from '~/screens/LoggedOut'
import LoggedIn from '~/screens/LoggedIn'
import SettingsList from '~/screens/SettingsList'

import Interactions from '~/screens/Modals/Interactions'
import PinRecoveryInstructions from '~/screens/Modals/PinRecoveryInstructions'
import Recovery from '~/screens/Modals/Recovery'
import Lock from '~/screens/Modals/Lock'
import DeviceAuthentication from './screens/Modals/DeviceAuthentication'

import { ScreenNames } from '~/types/screens'

import { isLogged } from './modules/account/selectors'

const RootStack = createStackNavigator()

const RootNavigation: React.FC = () => {
  const isLoggedIn = useSelector(isLogged)

  return (
    <NavigationContainer>
      <RootStack.Navigator headerMode="none" mode="modal">
        {isLoggedIn ? (
          <>
            <RootStack.Screen
              name={ScreenNames.LoggedIn}
              component={LoggedIn}
              options={{ gestureEnabled: false }}
            />
            {/* Logged in Modals -> Start */}
            <RootStack.Screen
              name={ScreenNames.SettingsList}
              component={SettingsList}
            />

            <RootStack.Screen
              name={ScreenNames.Interactions}
              component={Interactions}
            />
            <RootStack.Screen
              name={ScreenNames.DeviceAuth}
              component={DeviceAuthentication}
              options={{ gestureEnabled: false }}
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
            {/* Logged in Modals -> End */}
          </>
        ) : (
          <RootStack.Screen
            name={ScreenNames.LoggedOut}
            component={LoggedOut}
          />
        )}

        {/* Modals -> Start */}
        <RootStack.Screen name={ScreenNames.Recovery} component={Recovery} />
        {/* Modals -> End */}
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default RootNavigation
