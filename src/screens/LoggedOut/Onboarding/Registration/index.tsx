import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ScreenNames } from '~/types/screens'

import SeedPhraseRepeat from './SeedPhrase/SeedPhraseRepeat'
import SeedPhraseWrite from './SeedPhrase/SeedPhraseWrite'
import { screenTransitionSlideFromRight } from '~/utils/screenSettings'

const Stack = createStackNavigator()

const Registration: React.FC = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName={ScreenNames.SeedPhraseWrite}
      screenOptions={screenTransitionSlideFromRight}
    >
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
