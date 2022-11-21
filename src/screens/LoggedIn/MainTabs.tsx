import React, { useEffect } from 'react'
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
import useTranslation from '~/hooks/useTranslation'
import { useNavigation } from '@react-navigation/core'
import { useSelector } from 'react-redux'
import { getIsAppLocked } from '~/modules/account/selectors'
import { useDeeplinkInteractions } from '~/hooks/deeplinks'
import { getAusweisInteractionDetails } from '~/modules/interaction/selectors'

export type MainTabsParamList = {
  [ScreenNames.Identity]: undefined
  [ScreenNames.Documents]: { highlightIds?: string[] }

  [ScreenNames.History]: { id?: string }
  [ScreenNames.Settings]: undefined
}

const MainTabsNavigator = createBottomTabNavigator<MainTabsParamList>()

const MainTabs = () => {
  const { t } = useTranslation()
  const isAppLocked = useSelector(getIsAppLocked)
  const isAusweisInteracting = useSelector(getAusweisInteractionDetails)

  const navigation = useNavigation()

  useDeeplinkInteractions()

  useEffect(() => {
    if (!isAppLocked && isAusweisInteracting) {
      navigation.navigate(ScreenNames.Interaction, {
        screen: ScreenNames.eId,
      })
    }
  }, [JSON.stringify(isAusweisInteracting), isAppLocked])

  return (
    <MainTabsNavigator.Navigator
      initialRouteName={ScreenNames.Identity}
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
