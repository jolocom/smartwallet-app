import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ScreenNames } from '~/types/screens'
import Walkthrough from './Walkthrough'
import { LoggedOutParamList } from './types'
import Recovery from '../Modals/Recovery'

const Stack = createStackNavigator<LoggedOutParamList>()

const LoggedOut: React.FC = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName={ScreenNames.Walkthrough}
    >
      <Stack.Screen name={ScreenNames.Walkthrough} component={Walkthrough} />
      <Stack.Screen name={ScreenNames.IdentityRecovery} component={Recovery} />
    </Stack.Navigator>
  )
}

export default LoggedOut
