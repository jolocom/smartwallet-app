import React from 'react'
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs'

import { ScreenNames } from '~/types/screens'
import History from './History'
import Documents from './Documents'
import BottomBar from '~/components/BottomBar'
import Settings from './Settings'
import Identity from './Identity'
import { CredentialCategories } from '~/types/credentials'

export type MainTabsParamList = {
  [ScreenNames.Identity]: undefined
  [ScreenNames.Documents]: { initialTab?: CredentialCategories }
  [ScreenNames.History]: undefined
  [ScreenNames.Settings]: undefined
}

const MainTabsNavigator = createBottomTabNavigator<MainTabsParamList>()

const MainTabs = () => (
  <MainTabsNavigator.Navigator
    tabBar={(props: BottomTabBarProps) => {
      return <BottomBar {...props} />
    }}
  >
    <MainTabsNavigator.Screen
      name={ScreenNames.Identity}
      component={Identity}
    />
    <MainTabsNavigator.Screen
      name={ScreenNames.Documents}
      component={Documents}
    />
    <MainTabsNavigator.Screen name={ScreenNames.History} component={History} />
    <MainTabsNavigator.Screen
      name={ScreenNames.Settings}
      component={Settings}
    />
  </MainTabsNavigator.Navigator>
)

export default MainTabs
