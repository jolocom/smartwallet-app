import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useSelector } from 'react-redux'

import LoggedOut from '~/screens/LoggedOut'
import LoggedIn from '~/screens/LoggedIn'

import Recovery from '~/screens/Modals/Recovery'

import { ScreenNames } from '~/types/screens'

import { isLogged } from './modules/account/selectors'

const RootStack = createStackNavigator()

const RootNavigation: React.FC = () => {
  const isLoggedIn = useSelector(isLogged)

  return (
    <NavigationContainer>
      <RootStack.Navigator headerMode="none" mode="modal">
        {isLoggedIn ? (
          <RootStack.Screen
            name={ScreenNames.LoggedIn}
            component={LoggedIn}
            options={{ gestureEnabled: false }}
          />
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