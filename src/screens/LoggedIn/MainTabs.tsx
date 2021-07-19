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
import useTranslation from '~/hooks/useTranslation'

export type MainTabsParamList = {
  [ScreenNames.Identity]: undefined
  [ScreenNames.Documents]: { initialTab?: CredentialCategories }
  [ScreenNames.History]: undefined
  [ScreenNames.Settings]: undefined
}

const MainTabsNavigator = createBottomTabNavigator<MainTabsParamList>()

const MainTabs = () => {
  const { t } = useTranslation()

  return (
    <MainTabsNavigator.Navigator
      tabBar={(props: BottomTabBarProps) => {
        return <BottomBar {...props} />
      }}
    >
      <MainTabsNavigator.Screen
        name={ScreenNames.Identity}
        component={Identity}
        options={{ tabBarLabel: t('BottomBar.identity') }}
      />
      <MainTabsNavigator.Screen
        name={ScreenNames.Documents}
        component={Documents}
        options={{ tabBarLabel: t('BottomBar.documents') }}
      />
      <MainTabsNavigator.Screen
        name={ScreenNames.History}
        component={History}
        options={{ tabBarLabel: t('BottomBar.history') }}
      />
      <MainTabsNavigator.Screen
        name={ScreenNames.Settings}
        component={Settings}
        options={{ tabBarLabel: t('BottomBar.settings') }}
      />
    </MainTabsNavigator.Navigator>
  )
}

export default MainTabs
