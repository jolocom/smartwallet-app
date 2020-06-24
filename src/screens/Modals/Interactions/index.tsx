import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ScreenNames } from '~/types/screens'
import Scanner from './scanner'

const Stack = createStackNavigator()

const Interactions: React.FC = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name={ScreenNames.Scanner} component={Scanner} />
    </Stack.Navigator>
  )
}

export default Interactions
