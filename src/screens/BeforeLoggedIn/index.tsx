import { StackActions, useNavigation, useNavigationState } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React, { useCallback, useEffect, useRef } from 'react';
import { AppStateStatus, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useSyncStorageAttributes } from '~/hooks/attributes';
import useTermsConsent from '~/hooks/consent';
import { useSyncStorageCredentials } from '~/hooks/credentials';

import { useAppState } from '~/hooks/useAppState'
import { setAppLocked } from '~/modules/account/actions';
import { getIsAppLocked, isLocalAuthSet } from '~/modules/account/selectors';
import { setPopup } from '~/modules/appState/actions';
import { getIsPopup } from '~/modules/appState/selectors';
import { resetInteraction } from '~/modules/interaction/actions';
import { dismissLoader } from '~/modules/loader/actions';
import { ScreenNames } from '~/types/screens';
import { Colors } from '~/utils/colors';
import LoggedInTabs from '../LoggedIn';
import DeviceAuthentication from '../Modals/DeviceAuthentication';
import Lock from '../Modals/Lock';

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
    backgroundColor: Colors.mainBlack
  }
}

const BeforeLoggedIn = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isAuthSet = useSelector(isLocalAuthSet);
  const isAppLocked = useSelector(getIsAppLocked);
  const routeState = useNavigationState(state => state);

  const showLock = isAppLocked && isAuthSet;
  const showRegisterPin = !isAuthSet;
  const showTabs = !isAppLocked && isAuthSet

  const syncAttributes = useSyncStorageAttributes()
  const syncCredentials = useSyncStorageCredentials()
  const { checkConsent } = useTermsConsent()

  useEffect(() => {
    /* Checking if the Terms of Service have changed */
    checkConsent()

    /* Loading attributes and credentials into the store */
    syncAttributes()
    syncCredentials()
  }, [])

  // decide wether to show Lock or Register Pin or App
  useEffect(() => {
    if (showLock) {
      const childrenRoutes = routeState?.routes?.[0]?.state;
      if (childrenRoutes) {
        const {routes, index} = childrenRoutes
        if (index && routes?.[index].name !== ScreenNames.Lock) {
          navigation.dispatch(StackActions.push(ScreenNames.Lock))
        }
      }
    } else if (showRegisterPin) {
      // Show passcode registration screen
      navigation.navigate(ScreenNames.DeviceAuth);
    } else if (showTabs) {
      navigation.navigate(ScreenNames.LoggedIn)
    }
  }, [isAppLocked, isAuthSet])

  const dismissOverlays = useCallback(() => {
    dispatch(dismissLoader())
    dispatch(resetInteraction())
  }, [])

/* All about when lock screen comes up - START */
  const isPopup = useSelector(
    getIsPopup,
  ) /* isPopup is used as a workaround for Android app state change */

  const isPopupRef = useRef<boolean>(isPopup)

  useEffect(() => {
    isPopupRef.current = isPopup
  }, [isPopup])

  /* This watches app state change and locks app when necessary */
  useAppState((appState: AppStateStatus, nextAppState: AppStateStatus) => {
    // TODO: android is missing here
    if (Platform.OS === 'ios' && appState.match(/active/) && nextAppState.match(/inactive/)) {
      if (isAuthSet) {
        if (!isPopupRef.current) {
          dispatch(setAppLocked(true))
          dismissOverlays()
        } else dispatch(setPopup(false))
      }
    }
    appState = nextAppState
  })
/* All about when lock screen comes up - END */
  
  return (
    <BeforeLoggedInStack.Navigator
      headerMode="none"
    >
      <BeforeLoggedInStack.Screen
        name={ScreenNames.Lock}
        component={Lock}
        options={{...settingsScreenTransitionOptions, gestureEnabled: false}}
      />
      <BeforeLoggedInStack.Screen
        name={ScreenNames.LoggedIn}
        component={LoggedInTabs}
        options={{gestureEnabled: false}}
      />
      <BeforeLoggedInStack.Screen
        name={ScreenNames.DeviceAuth}
        component={DeviceAuthentication}
        options={{...settingsScreenTransitionOptions, gestureEnabled: false}}
      />
    </BeforeLoggedInStack.Navigator>
  )
}

export default BeforeLoggedIn;