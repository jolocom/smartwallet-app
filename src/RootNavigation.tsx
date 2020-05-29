import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import LoggedOut from '~/screens/LoggedOut'
import LoggedIn from '~/screens/LoggedIn'
import Interactions from '~/screens/Modals/Interactions'

import { ScreenNames } from '~/types/screens'

const RootStack = createStackNavigator()

const RootNavigation: React.FC = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator headerMode="none" mode="modal">
        <RootStack.Screen name={ScreenNames.LoggedOut} component={LoggedOut} />
        <RootStack.Screen name={ScreenNames.LoggedIn} component={LoggedIn} />
        <RootStack.Screen
          name={ScreenNames.Interactions}
          component={Interactions}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default RootNavigation
