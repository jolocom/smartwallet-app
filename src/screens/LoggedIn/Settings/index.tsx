import React from 'react'

import { ScreenNames } from '~/types/screens'
import { createStackNavigator } from '@react-navigation/stack'
import SettingsGeneral from './General'
import Language from './Language'
import ChangePin from './ChangePin'
import FAQ from './FAQ'
import ContactUs from './ContactUs'
import RateUs from './RateUs'
import About from './About'
import Imprint from './Imprint'

const Stack = createStackNavigator()

const Settings = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen
      name={ScreenNames.SettingsGeneral}
      component={SettingsGeneral}
    />
    <Stack.Screen name={ScreenNames.Language} component={Language} />
    <Stack.Screen name={ScreenNames.ChangePin} component={ChangePin} />
    <Stack.Screen name={ScreenNames.FAQ} component={FAQ} />
    <Stack.Screen name={ScreenNames.ContactUs} component={ContactUs} />
    <Stack.Screen name={ScreenNames.RateUs} component={RateUs} />
    <Stack.Screen name={ScreenNames.About} component={About} />
    <Stack.Screen name={ScreenNames.Imprint} component={Imprint} />
  </Stack.Navigator>
)

export default Settings
