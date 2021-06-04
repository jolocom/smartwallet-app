import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ScreenNames } from '~/types/screens'

import Entropy from './Entropy'
import SeedPhraseRepeat from './SeedPhrase/SeedPhraseRepeat'
import SeedPhraseWrite from './SeedPhrase/SeedPhraseWrite'

const Stack = createStackNavigator()

const Registration: React.FC = () => {
  return (
    <Stack.Navigator headerMode="none" initialRouteName={ScreenNames.Entropy}>
      <Stack.Screen name={ScreenNames.Entropy} component={Entropy} />
      <Stack.Screen
        name={ScreenNames.SeedPhraseWrite}
        component={SeedPhraseWrite}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenNames.SeedPhraseRepeat}
        component={SeedPhraseRepeat}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  )
}

export default Registration
