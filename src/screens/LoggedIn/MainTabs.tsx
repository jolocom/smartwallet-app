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
import { CredentialCategories } from '~/types/credentials'
import useTranslation from '~/hooks/useTranslation'
import { useInteractionStart } from '~/hooks/interactions/handlers'
import { useNavigation } from '@react-navigation/core'
import { useInteractionEvents } from '~/hooks/interactions/listeners'
import { useSelector } from 'react-redux'
import { getIsAppLocked } from '~/modules/account/selectors'
import { getInteractionType } from '~/modules/interaction/selectors'
import { getAusweisInteractionDetails } from '~/modules/interaction/selectors'
import { useDeeplinkInteractions } from '~/hooks/deeplinks'

export type MainTabsParamList = {
  [ScreenNames.Identity]: undefined
  [ScreenNames.Documents]: { initialTab?: CredentialCategories }
  [ScreenNames.History]: undefined
  [ScreenNames.Settings]: undefined
}

const MainTabsNavigator = createBottomTabNavigator<MainTabsParamList>()

const MainTabs = () => {
  const { t } = useTranslation()
  const isAppLocked = useSelector(getIsAppLocked)
  const isInteracting = useSelector(getInteractionType)
  const isAusweisInteracting = useSelector(getAusweisInteractionDetails)

  const { showInteraction } = useInteractionStart()
  const navigation = useNavigation()

  useDeeplinkInteractions()
  useInteractionEvents(showInteraction)

  // Show an interaction sheet declaratively by
  // observing store changes
  useEffect(() => {
    if (!isAppLocked && isInteracting) {
      navigation.navigate(ScreenNames.Interaction, {
        screen: ScreenNames.InteractionFlow,
      })
    }
  }, [isInteracting, isAppLocked])

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
