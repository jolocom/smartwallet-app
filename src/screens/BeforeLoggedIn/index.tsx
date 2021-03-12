import { StackActions, useNavigation } from '@react-navigation/native'
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
import React, { useCallback, useEffect, useRef } from 'react'
import { Platform } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import ScreenContainer from '~/components/ScreenContainer'
import { useSyncStorageAttributes } from '~/hooks/attributes'
import useTermsConsent from '~/hooks/consent'
import { useSyncStorageCredentials } from '~/hooks/credentials'
import { useAllCredentials } from '~/hooks/signedCredentials'

import { useGetAppStates } from '~/hooks/useAppState'
import { setAppLocked } from '~/modules/account/actions'
import { getIsAppLocked, isLocalAuthSet } from '~/modules/account/selectors'
import { setPopup } from '~/modules/appState/actions'
import { getIsPopup } from '~/modules/appState/selectors'
import { resetInteraction } from '~/modules/interaction/actions'
import { dismissLoader } from '~/modules/loader/actions'
import { getLoaderState } from '~/modules/loader/selectors'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import LoggedInTabs from '../LoggedIn'
import DeviceAuthentication from '../Modals/DeviceAuthentication'
import Lock from '../Modals/Lock'

const BeforeLoggedInStack = createStackNavigator()

const settingsScreenTransitionOptions = {
  ...Platform.select({
    ios: {
      ...TransitionPresets.ModalSlideFromBottomIOS,
    },
    android: {
      ...TransitionPresets.DefaultTransition,
    },
  }),
  cardStyle: {
    backgroundColor: Colors.mainBlack,
  },
}

const Idle = () => {
  return <ScreenContainer />
}

const BeforeLoggedIn = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const isAuthSet = useSelector(isLocalAuthSet)
  const isAppLocked = useSelector(getIsAppLocked)

  const { isVisible: isLoaderVisible } = useSelector(getLoaderState)

  const showLock = isAppLocked && isAuthSet
  const showRegisterPin = !isAuthSet
  const showTabs = !isAppLocked && isAuthSet

  const syncAttributes = useSyncStorageAttributes()
  const syncCredentials = useSyncStorageCredentials()
  const initializeAllCredentials = useAllCredentials()
  const { checkConsent } = useTermsConsent()

  useEffect(() => {
    /* Checking if the Terms of Service have changed */
    checkConsent()

    /* Loading attributes and credentials into the store */
    syncAttributes()
    // syncCredentials()
    initializeAllCredentials()
  }, [])

  // decide wether to show Lock or Register Pin or App
  useEffect(() => {
    if (!isLoaderVisible) {
      if (showLock) {
        navigation.dispatch(StackActions.push(ScreenNames.Lock))
      } else if (showRegisterPin) {
        // Show passcode registration screen
        navigation.navigate(ScreenNames.DeviceAuth)
      } else if (showTabs) {
        navigation.navigate(ScreenNames.LoggedIn)
      }
    }
  }, [isAppLocked, isAuthSet, isLoaderVisible])

  const dismissOverlays = useCallback(() => {
    dispatch(dismissLoader())
  }, [])

  /* All about when lock screen comes up - START */
  const isPopup = useSelector(
    getIsPopup,
  ) /* isPopup is used as a workaround for Android app state change */

  const isPopupRef = useRef<boolean>(isPopup)

  useEffect(() => {
    isPopupRef.current = isPopup
  }, [isPopup])

  const { currentAppState, prevAppState } = useGetAppStates()

  useEffect(() => {
    if (
      prevAppState &&
      prevAppState.match(/active/) &&
      currentAppState.match(/inactive|background/)
    ) {
      if (isAuthSet) {
        if (!isPopupRef.current) {
          dispatch(setAppLocked(true))
          dismissOverlays()
        } else dispatch(setPopup(false))
      }
    }
  }, [currentAppState])
  /* All about when lock screen comes up - END */

  return (
    <BeforeLoggedInStack.Navigator headerMode="none">
      {/* NOTE: idle screen functions as a background:
      when a user is redirected from LoggedOut to BeforeLoggedIn
      we don't want to see noticeable screen switching
      (from Lock to Register Passcode, because Lock served as a initialRouteName),
      but rather displaying just a background screen */}
      <BeforeLoggedInStack.Screen
        name="Idle"
        component={Idle}
        options={{ ...settingsScreenTransitionOptions, gestureEnabled: false }}
      />
      <BeforeLoggedInStack.Screen
        name={ScreenNames.Lock}
        component={Lock}
        options={{ ...settingsScreenTransitionOptions, gestureEnabled: false }}
      />
      <BeforeLoggedInStack.Screen
        name={ScreenNames.LoggedIn}
        component={LoggedInTabs}
        options={{ gestureEnabled: false }}
      />
      <BeforeLoggedInStack.Screen
        name={ScreenNames.DeviceAuth}
        component={DeviceAuthentication}
        options={{ ...settingsScreenTransitionOptions, gestureEnabled: false }}
      />
    </BeforeLoggedInStack.Navigator>
  )
}

export default BeforeLoggedIn
