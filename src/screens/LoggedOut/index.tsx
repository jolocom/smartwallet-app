import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ScreenNames } from '~/types/screens'

import Walkthrough from './Walkthrough'
import Entropy from './Entropy'
import SeedPhraseRepeat from './SeedPhraseRepeat'
import SeedPhraseInfo from './SeedPhraseInfo'
import SeedPhraseWrite from './SeedPhrase/SeedPhraseWrite'

const Stack = createStackNavigator()

const LoggedOut: React.FC = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName={ScreenNames.Walkthrough}
    >
      <Stack.Screen name={ScreenNames.Walkthrough} component={Walkthrough} />
      <Stack.Screen name={ScreenNames.Entropy} component={Entropy} />
      <Stack.Screen name={ScreenNames.SeedPhraseWrite} component={SeedPhraseWrite} />
      <Stack.Screen
        name={ScreenNames.SeedPhraseInfo}
        component={SeedPhraseInfo}
      />
      <Stack.Screen
        name={ScreenNames.SeedPhraseRepeat}
        component={SeedPhraseRepeat}
      />
    </Stack.Navigator>
  )
}

export default LoggedOut
