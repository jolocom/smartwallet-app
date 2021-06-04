import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ScreenNames } from '~/types/screens'
import Walkthrough from './Walkthrough'
import Onboarding from './Onboarding'
import { LoggedOutParamList } from './types'
import { getDangerouslyDisableGestureParamFromRoute } from '~/utils/navigation'

const Stack = createStackNavigator<LoggedOutParamList>()

const LoggedOut: React.FC = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName={ScreenNames.Walkthrough}
      screenOptions={({ route }) => {
        return {
          gestureEnabled: getDangerouslyDisableGestureParamFromRoute(route),
        }
      }}
    >
      <Stack.Screen name={ScreenNames.Walkthrough} component={Walkthrough} />
      <Stack.Screen name={ScreenNames.Onboarding} component={Onboarding} />
    </Stack.Navigator>
  )
}

export default LoggedOut
