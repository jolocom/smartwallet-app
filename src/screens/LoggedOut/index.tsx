import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ScreenNames } from '~/types/screens'
import Walkthrough from './Walkthrough'
import { LoggedOutParamList } from './types'
import Recovery from '../Modals/Recovery'
import ScreenContainer from '~/components/ScreenContainer'

const Stack = createStackNavigator<LoggedOutParamList>()

const Idle = () => <ScreenContainer />

const LoggedOut: React.FC = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName={ScreenNames.Walkthrough}
    >
      <Stack.Screen name={ScreenNames.Walkthrough} component={Walkthrough} />
      <Stack.Screen name={ScreenNames.IdentityRecovery} component={Recovery} />
      {/*Idle screen serves as a background when terms consent is hiding, so we don't see for a fraction of a second the Walkthrough screen */}
      <Stack.Screen name={ScreenNames.Idle} component={Idle} />
    </Stack.Navigator>
  )
}

export default LoggedOut
