import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import LoggedOut from '~/screens/LoggedOut'
import DeviceAuthentication from './screens/DeviceAuthentication'
import LoggedIn from '~/screens/LoggedIn'
import Interactions from '~/screens/Modals/Interactions'

import { ScreenNames } from '~/types/screens'

import { isLogged } from './modules/account/selectors'
import { useSelector } from 'react-redux'

const RootStack = createStackNavigator()

const RootNavigation: React.FC = () => {
  const isLoggedIn = useSelector(isLogged)

  return (
    <NavigationContainer>
      <RootStack.Navigator headerMode="none" mode="modal">
        <RootStack.Screen name={ScreenNames.LoggedOut} component={LoggedOut} />
        {/* {isLoggedIn ? (
          <RootStack.Screen name={ScreenNames.LoggedIn} component={LoggedIn} />
        ) : (
          <RootStack.Screen
            name={ScreenNames.LoggedOut}
            component={LoggedOut}
          />
        )} */}
        <RootStack.Screen
          name={ScreenNames.DeviceAuth}
          component={DeviceAuthentication}
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
