import React, { useCallback, useEffect, useRef } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useDispatch, useSelector } from 'react-redux'
import { useBackHandler } from '@react-native-community/hooks'
import { AppStateStatus, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { ScreenNames } from '~/types/screens'
import { getLoaderState } from '~/modules/loader/selectors'
import { isLocalAuthSet, isLogged } from '~/modules/account/selectors'
import useRedirectTo from '~/hooks/useRedirectTo'

import Claims from './Claims'
import Documents from './Documents'
import History from './History'
import Settings from './Settings'

import { dismissLoader } from '~/modules/loader/actions'
import { resetInteraction } from '~/modules/interaction/actions'
import { getIsPopup } from '~/modules/appState/selectors'
import { setPopup } from '~/modules/appState/actions'
import BottomBar from '~/components/BottomBar'

import { useAppState } from '~/hooks/useAppState'

import { useSyncStorageAttributes } from '~/hooks/attributes'
import { useSyncStorageCredentials } from '~/hooks/credentials'

const MainTabs = createBottomTabNavigator()

const LoggedInTabs: React.FC = () => {
  const redirectToDeviceAuth = useRedirectTo(ScreenNames.DeviceAuth)
  const { isVisible: isLoaderVisible } = useSelector(getLoaderState)
  const isAuthSet = useSelector(isLocalAuthSet)
  const isLoggedIn = useSelector(isLogged)

  const syncAttributes = useSyncStorageAttributes()
  const syncCredentials = useSyncStorageCredentials()

  /* this hook is responsible for displaying device auth screen only after the Loader modal is hidden
  otherwise, the keyboard appears on top loader modal */
  useEffect(() => {
    if (!isLoaderVisible && !isAuthSet && isLoggedIn) {
      redirectToDeviceAuth()
    }
  }, [isLoaderVisible, isAuthSet])

  /* Loading attributes and credentials into the store */
  useEffect(() => {
    syncAttributes()
    syncCredentials()
  }, [])

  /* All about when lock screen comes up - START */
  const isPopup = useSelector(
    getIsPopup,
  ) /* isPopup is used as a workaround for Android app state change */

  const isPopupRef = useRef<boolean>(isPopup)

  const navigation = useNavigation()
  const dispatch = useDispatch()

  useEffect(() => {
    isPopupRef.current = isPopup
  }, [isPopup])

  /* This will trigger the lock screen on starting the app when identity was created */
  useEffect(() => {
    if (isAuthSet) {
      lockApp()
    }
  }, [])

  const lockApp = useCallback(() => {
    navigation.navigate(ScreenNames.Lock)
  }, [])

  const dismissOverlays = useCallback(() => {
    dispatch(dismissLoader())
    dispatch(resetInteraction())
  }, [])

  /* This watches app state change and locks app when necessary */
  useAppState((appState: AppStateStatus, nextAppState: AppStateStatus) => {
    if (
      (Platform.OS === 'ios' &&
        appState.match(/inactive|active/) &&
        nextAppState.match(/background/)) ||
      (Platform.OS === 'android' &&
        appState.match(/inactive|background/) &&
        nextAppState.match(/active/))
    ) {
      if (isAuthSet) {
        if (!isPopupRef.current) {
          dismissOverlays()
          lockApp()
        } else dispatch(setPopup(false))
      }
    }
    appState = nextAppState
  })
  /* All about when lock screen comes up - END */

  useBackHandler(() => true)

  return (
    <MainTabs.Navigator
      tabBar={(props) => {
        return <BottomBar {...props} />
      }}
    >
      <MainTabs.Screen name={ScreenNames.Claims} component={Claims} />
      <MainTabs.Screen name={ScreenNames.Documents} component={Documents} />
      <MainTabs.Screen name={ScreenNames.History} component={History} />
      <MainTabs.Screen name={ScreenNames.Settings} component={Settings} />
    </MainTabs.Navigator>
  )
}

export default LoggedInTabs
