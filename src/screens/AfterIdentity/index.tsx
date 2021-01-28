import {useNavigation, useRoute } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React, { useCallback, useEffect, useRef } from 'react';
import { AppStateStatus, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ScreenContainer from '~/components/ScreenContainer';
import { useSyncStorageAttributes } from '~/hooks/attributes';
import useTermsConsent from '~/hooks/consent';
import { useSyncStorageCredentials } from '~/hooks/credentials';
import { useRedirectTo } from '~/hooks/navigation';

import { useAppState } from '~/hooks/useAppState'
import { setAppLocked } from '~/modules/account/actions';
import { isLocalAuthSet } from '~/modules/account/selectors';
import { setPopup } from '~/modules/appState/actions';
import { getIsPopup } from '~/modules/appState/selectors';
import { resetInteraction } from '~/modules/interaction/actions';
import { dismissLoader } from '~/modules/loader/actions';
import { ScreenNames } from '~/types/screens';
import LoggedInTabs from '../LoggedIn';
import DeviceAuthentication from '../Modals/DeviceAuthentication';
import Lock from '../Modals/Lock';
import PinRecoveryInstructions from '../Modals/PinRecoveryInstructions';

const AfterIdentityStack = createStackNavigator()

const settingsScreenTransitionOptions = {
  ...Platform.select({
    ios: {
      ...TransitionPresets.ModalTransition,
    },
    android: {
      ...TransitionPresets.DefaultTransition,
    },
  }),
}

const AfterIdentity = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()


  const redirectToDeviceAuth = useRedirectTo(ScreenNames.DeviceAuth)

  const isAuthSet = useSelector(isLocalAuthSet)

  /* All about when lock screen comes up - START */
  const isPopup = useSelector(
    getIsPopup,
  ) /* isPopup is used as a workaround for Android app state change */

  const isPopupRef = useRef<boolean>(isPopup)

  const syncAttributes = useSyncStorageAttributes()
  const syncCredentials = useSyncStorageCredentials()
  const { checkConsent } = useTermsConsent()

  useEffect(() => {
    if (isAuthSet) {
      lockApp()
    } else {
      redirectToDeviceAuth()
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
    // TODO: android is missing here
    if (Platform.OS === 'ios' && appState.match(/inactive/) && nextAppState.match(/background/)) {
      if (isAuthSet) {
        if (!isPopupRef.current) {
          console.log('locking the app');
          
          lockApp()
          dismissOverlays()
        } else dispatch(setPopup(false))
      }
    }
    appState = nextAppState
  })
  /* All about when lock screen comes up - END */
  
  return (
    <ScreenContainer />
  )
}

export default () => {
    const route = useRoute();
console.log({route});
  return (
    <AfterIdentityStack.Navigator>
      <AfterIdentityStack.Screen
        name="After identity container"
        component={AfterIdentity}
        options={{ gestureEnabled: false, ...settingsScreenTransitionOptions }}
      />
      <AfterIdentityStack.Screen
        name={ScreenNames.Lock}
        component={Lock}
        options={{ gestureEnabled: false, ...settingsScreenTransitionOptions }}
      />
      <AfterIdentityStack.Screen
        name={ScreenNames.DeviceAuth}
        component={DeviceAuthentication}
        options={{ gestureEnabled: false, ...settingsScreenTransitionOptions }}
      />
      <AfterIdentityStack.Screen
        name={ScreenNames.PinRecoveryInstructions}
        component={PinRecoveryInstructions}
      />
      <AfterIdentityStack.Screen
        name={ScreenNames.LoggedIn}
        component={LoggedInTabs}
      />      
    </AfterIdentityStack.Navigator>
  )
};