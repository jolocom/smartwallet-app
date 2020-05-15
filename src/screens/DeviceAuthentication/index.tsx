import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ScreenNames } from '~/types/screens'

import Passcode from './Passcode'
import Biometrics from './Biometrics'

const Stack = createStackNavigator()

const DeviceAuthentication: React.FC = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName={ScreenNames.Walkthrough}
    >
      <Stack.Screen name={ScreenNames.Passcode} component={Passcode} />
      <Stack.Screen name={ScreenNames.Biometrics} component={Biometrics} />
    </Stack.Navigator>
  )
}

export default DeviceAuthentication
