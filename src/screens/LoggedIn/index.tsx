import React, { useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useSelector } from 'react-redux'

import { ScreenNames } from '~/types/screens'
import { getLoaderState } from '~/modules/loader/selectors'
import {
  isAppLocked,
  isLocalAuthSet,
  isLogged,
} from '~/modules/account/selectors'
import useRedirectTo from '~/hooks/useRedirectTo'

import Claims from './Claims'
import Documents from './Documents'
import History from './History'
import Settings from './Settings'
import BottomBar from '~/components/BottomBar'
import { useSyncStorageAttributes } from '~/hooks/attributes'
import { useSyncStorageCredentials } from '~/hooks/credentials'
import { Dimensions, View } from 'react-native'
import { Colors } from '~/utils/colors'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const MainTabs = createBottomTabNavigator()

const LoggedInTabs: React.FC = () => {
  const redirectToDeviceAuth = useRedirectTo(ScreenNames.DeviceAuth)
  const { isVisible } = useSelector(getLoaderState)
  const isAuthSet = useSelector(isLocalAuthSet)
  const isLoggedIn = useSelector(isLogged)
  const isLocked = useSelector(isAppLocked)

  const syncAttributes = useSyncStorageAttributes()
  const syncCredentials = useSyncStorageCredentials()

  // this hook is responsible for displaying device auth screen only after the Loader modal is hidden
  // otherwise, the keyboard appears on top loader modal
  useEffect(() => {
    if (!isVisible && !isAuthSet && isLoggedIn) {
      redirectToDeviceAuth()
    }
  }, [isVisible, isAuthSet])

  useEffect(() => {
    syncAttributes()
    syncCredentials()
  }, [])

  if (!isLocked) {
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
  return (
    <View
      style={{
        backgroundColor: Colors.mainBlack,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
      }}
    />
  )
}

export default LoggedInTabs