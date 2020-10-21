import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ScreenNames } from '~/types/screens'

import Walkthrough from './Walkthrough'
import Entropy from './Entropy'
import SeedPhrase from './SeedPhrase'
import SeedPhraseRepeat from './SeedPhraseRepeat'

const Stack = createStackNavigator()

const LoggedOut: React.FC = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName={ScreenNames.Walkthrough}
    >
      <Stack.Screen name={ScreenNames.Walkthrough} component={Walkthrough} />
      <Stack.Screen name={ScreenNames.Entropy} component={Entropy} />
      <Stack.Screen name={ScreenNames.SeedPhrase} component={SeedPhrase} />
      <Stack.Screen
        name={ScreenNames.SeedPhraseRepeat}
        component={SeedPhraseRepeat}
      />
    </Stack.Navigator>
  )
}

export default LoggedOut
