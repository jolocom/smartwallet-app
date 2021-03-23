import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useGetAppStates } from '~/hooks/useAppState'
import { setAppLocked } from '~/modules/account/actions'
import { getIsAppLocked, isLocalAuthSet } from '~/modules/account/selectors'
import { setPopup } from '~/modules/appState/actions'
import { getIsPopup } from '~/modules/appState/selectors'
import { dismissLoader } from '~/modules/loader/actions'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import DeviceAuthentication from '../Modals/DeviceAuthentication'
import Lock from '../Modals/Lock'
import Recovery from '../Modals/Recovery'
import PinRecoveryInstructions from '../Modals/PinRecoveryInstructions'
import Main from './Main'
import { useInitializeCredentials } from '~/hooks/signedCredentials'
import BusinessCardForm from '../Modals/Forms/BusinessCardForm'
import CredentialForm from '../Modals/Forms/CredentialForm'
import { PrimitiveAttributeTypes } from '~/types/credentials'

export type LoggedInStackParamList = {
  Idle: undefined
  [ScreenNames.PasscodeRecovery]: {
    isAccessRestore: boolean
  }
  [ScreenNames.Main]: undefined
  [ScreenNames.Lock]: undefined
  [ScreenNames.PinRecoveryInstructions]: undefined
  [ScreenNames.DeviceAuth]: undefined
  [ScreenNames.BusinessCardForm]: undefined
  [ScreenNames.CredentialForm]: { type: PrimitiveAttributeTypes; id?: string }
}

const LoggedInStack = createStackNavigator<LoggedInStackParamList>()

const settingsScreenTransitionOptions = {
  ...TransitionPresets.ModalSlideFromBottomIOS,
  cardStyle: {
    backgroundColor: Colors.mainBlack,
  },
}

const LoggedIn = () => {
  const dispatch = useDispatch()
  const isAuthSet = useSelector(isLocalAuthSet)
  const isAppLocked = useSelector(getIsAppLocked)

  const showLock = isAppLocked && isAuthSet
  const showRegisterPin = !isAuthSet
  const showTabs = !isAppLocked && isAuthSet
  const { initializeCredentials } = useInitializeCredentials()

  useEffect(() => {
    initializeCredentials()
  }, [])

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
    <LoggedInStack.Navigator headerMode="none">
      {showLock ? (
        <LoggedInStack.Screen
          name={ScreenNames.Lock}
          component={Lock}
          options={{
            ...settingsScreenTransitionOptions,
            gestureEnabled: false,
            cardStyle: { backgroundColor: Colors.mainBlack },
          }}
        />
      ) : showRegisterPin ? (
        <LoggedInStack.Screen
          name={ScreenNames.DeviceAuth}
          component={DeviceAuthentication}
          options={{
            ...settingsScreenTransitionOptions,
            gestureEnabled: false,
            cardStyle: { backgroundColor: Colors.mainBlack },
          }}
        />
      ) : showTabs ? (
        <LoggedInStack.Screen
          name={ScreenNames.Main}
          component={Main}
          options={{ gestureEnabled: false }}
        />
      ) : null}
      <LoggedInStack.Screen
        name={ScreenNames.PinRecoveryInstructions}
        component={PinRecoveryInstructions}
        options={{ ...settingsScreenTransitionOptions, gestureEnabled: false }}
      />
      <LoggedInStack.Screen
        name={ScreenNames.PasscodeRecovery}
        component={Recovery}
        options={{ ...settingsScreenTransitionOptions, gestureEnabled: false }}
      />
      <LoggedInStack.Screen
        name={ScreenNames.BusinessCardForm}
        component={BusinessCardForm}
        options={{ ...settingsScreenTransitionOptions, gestureEnabled: false }}
      />
      <LoggedInStack.Screen
        name={ScreenNames.CredentialForm}
        component={CredentialForm}
        options={{ ...settingsScreenTransitionOptions, gestureEnabled: false }}
      />
      {/* Modals -> End */}
    </LoggedInStack.Navigator>
  )
}

export default LoggedIn
