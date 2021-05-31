import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ScreenNames } from '~/types/screens'
import Walkthrough from './Walkthrough'
import Onboarding from './Onboarding'
import { LoggedOutParamList } from './types'

const Stack = createStackNavigator<LoggedOutParamList>()

const LoggedOut: React.FC = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName={ScreenNames.Walkthrough}
    >
      <Stack.Screen
        name={ScreenNames.Walkthrough}
        component={Walkthrough}
        options={{ gestureEnabled: __DEV__ }}
      />
      <Stack.Screen name={ScreenNames.Onboarding} component={Onboarding} />
    </Stack.Navigator>
  )
}

export default LoggedOut
