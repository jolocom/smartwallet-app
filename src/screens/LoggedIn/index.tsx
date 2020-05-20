import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { ScreenNames } from '~/types/screens'

import Claims from './Claims'
import Documents from './Documents'
import History from './History'
import Settings from './Settings'

const MainTabs = createBottomTabNavigator()

const LoggedInTabs: React.FC = () => {
  return (
    <MainTabs.Navigator>
      <MainTabs.Screen name={ScreenNames.Claims} component={Claims} />
      <MainTabs.Screen name={ScreenNames.Documents} component={Documents} />
      <MainTabs.Screen name={ScreenNames.History} component={History} />
      <MainTabs.Screen name={ScreenNames.Settings} component={Settings} />
    </MainTabs.Navigator>
  )
}

export default LoggedInTabs
