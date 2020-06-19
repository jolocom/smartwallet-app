import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'
import { ScreenNames } from '~/types/screens'
import ChangePin from './ChangePin'

const Stack = createStackNavigator()

const SettingsList: React.FC = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name={ScreenNames.ChangePin} component={ChangePin} />
    </Stack.Navigator>
  )
}

export default SettingsList
