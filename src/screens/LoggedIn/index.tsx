import React, { useCallback, useEffect, useRef } from 'react'
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs'
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import { AppStateStatus, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { ScreenNames } from '~/types/screens'
import { getLoaderState } from '~/modules/loader/selectors'
import { isLocalAuthSet, isLogged } from '~/modules/account/selectors'
import { useRedirectTo } from '~/hooks/navigation'

import Interactions from '~/screens/Modals/Interactions'
import DeviceAuthentication from '~/screens/Modals/DeviceAuthentication'
import PinRecoveryInstructions from '~/screens/Modals/PinRecoveryInstructions'
import Lock from '~/screens/Modals/Lock'

import Claims from './Claims'
import History from '../History'
import Documents from '../Documents'

import { dismissLoader } from '~/modules/loader/actions'
import { resetInteraction } from '~/modules/interaction/actions'
import { getIsPopup } from '~/modules/appState/selectors'
import { setPopup } from '~/modules/appState/actions'
import BottomBar from '~/components/BottomBar'

import { useAppState } from '~/hooks/useAppState'

import { useSyncStorageAttributes } from '~/hooks/attributes'
import { useSyncStorageCredentials } from '~/hooks/credentials'
import Settings from './Settings'
import Language from './Settings/Language'
import ChangePin from './Settings/ChangePin'
import FAQ from './Settings/FAQ'
import ContactUs from './Settings/ContactUs'
import About from './Settings/About'
import Imprint from './Settings/Imprint'
import PrivacyPolicy from './Settings/PrivacyPolicy'
import TermsOfService from './Settings/TermsOfService'
import useTermsConsent from '~/hooks/consent'
import { setAppLocked } from '~/modules/account/actions'
import BackupIdentity from './Settings/BackupIdentity'
import ButtonsTest from './Settings/Development/ButtonsTest'

const MainTabs = createBottomTabNavigator()
const LoggedInStack = createStackNavigator()

const Tabs = () => (
  <MainTabs.Navigator
    tabBar={(props: BottomTabBarProps) => {
      return <BottomBar {...props} />
    }}
  >
    <MainTabs.Screen name={ScreenNames.Claims} component={Claims} />
    <MainTabs.Screen name={ScreenNames.Documents} component={Documents} />
    <MainTabs.Screen name={ScreenNames.History} component={History} />
    <MainTabs.Screen name={ScreenNames.Settings} component={Settings} />
  </MainTabs.Navigator>
)

const settingsScreenTransitionOptions = {
  ...Platform.select({
    ios: {
      ...TransitionPresets.SlideFromRightIOS,
    },
    android: {
      ...TransitionPresets.DefaultTransition,
    },
  }),
}

const LoggedInTabs: React.FC = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const redirectToDeviceAuth = useRedirectTo(ScreenNames.DeviceAuth)
  const { isVisible: isLoaderVisible } = useSelector(getLoaderState)
  const isAuthSet = useSelector(isLocalAuthSet)
  const isLoggedIn = useSelector(isLogged)

  /* All about when lock screen comes up - START */
  const isPopup = useSelector(
    getIsPopup,
  ) /* isPopup is used as a workaround for Android app state change */

  const isPopupRef = useRef<boolean>(isPopup)

  const syncAttributes = useSyncStorageAttributes()
  const syncCredentials = useSyncStorageCredentials()
  const { checkConsent } = useTermsConsent()

  /* this hook is responsible for displaying device auth screen only after the Loader modal is hidden
  otherwise, the keyboard appears on top loader modal */
  useEffect(() => {
    if (!isLoaderVisible && !isAuthSet && isLoggedIn) {
      redirectToDeviceAuth()
    }
  }, [isLoaderVisible, isAuthSet])

  useEffect(() => {
    /* This will trigger the lock screen on starting the app when identity was created */
    if (isAuthSet) {
      lockApp()
    }
    /* Checking if the Terms of Service have changed */
    checkConsent()

    /* Loading attributes and credentials into the store */
    syncAttributes()
    syncCredentials()
  }, [])

  useEffect(() => {
    isPopupRef.current = isPopup
  }, [isPopup])

  const lockApp = useCallback(() => {
    dispatch(setAppLocked(true))
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
        appState.match(/background/) &&
        nextAppState.match(/inactive|active/)) ||
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

  return (
    <LoggedInStack.Navigator
      headerMode="none"
      mode="modal"
      initialRouteName={ScreenNames.Tabs}
    >
      <LoggedInStack.Screen name={ScreenNames.Tabs} component={Tabs} />

      {/* Settings Screens -> Start   */}
      <LoggedInStack.Screen
        name={ScreenNames.Language}
        component={Language}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <LoggedInStack.Screen
        name={ScreenNames.ChangePin}
        component={ChangePin}
        options={settingsScreenTransitionOptions}
      />
      <LoggedInStack.Screen
        name={ScreenNames.BackupIdentity}
        component={BackupIdentity}
        options={settingsScreenTransitionOptions}
      />
      <LoggedInStack.Screen
        name={ScreenNames.FAQ}
        component={FAQ}
        options={settingsScreenTransitionOptions}
      />
      <LoggedInStack.Screen
        name={ScreenNames.ContactUs}
        component={ContactUs}
        options={settingsScreenTransitionOptions}
      />
      <LoggedInStack.Screen
        name={ScreenNames.About}
        component={About}
        options={settingsScreenTransitionOptions}
      />
      <LoggedInStack.Screen
        name={ScreenNames.Imprint}
        component={Imprint}
        options={settingsScreenTransitionOptions}
      />
      <LoggedInStack.Screen
        name={ScreenNames.PrivacyPolicy}
        component={PrivacyPolicy}
        options={settingsScreenTransitionOptions}
      />
      <LoggedInStack.Screen
        name={ScreenNames.TermsOfService}
        component={TermsOfService}
        options={settingsScreenTransitionOptions}
      />

      {__DEV__ && (
        <LoggedInStack.Screen
          name={ScreenNames.ButtonsTest}
          component={ButtonsTest}
          options={settingsScreenTransitionOptions}
        />
      )}
      {/* Settings Screens -> End   */}

      {/* Modals -> Start */}
      <LoggedInStack.Screen
        name={ScreenNames.Interactions}
        component={Interactions}
      />
      <LoggedInStack.Screen
        name={ScreenNames.DeviceAuth}
        component={DeviceAuthentication}
        options={{ gestureEnabled: false }}
      />
      <LoggedInStack.Screen
        name={ScreenNames.Lock}
        component={Lock}
        options={{ gestureEnabled: false }}
      />
      <LoggedInStack.Screen
        name={ScreenNames.PinRecoveryInstructions}
        component={PinRecoveryInstructions}
      />
      {/* Modals -> End */}
    </LoggedInStack.Navigator>
  )
}

export default LoggedInTabs
