import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useGetAppStates } from '~/hooks/useAppState'
import { setAppLocked } from '~/modules/account/actions'
import { getIsAppLocked, isLocalAuthSet } from '~/modules/account/selectors'
import { setPopup } from '~/modules/appState/actions'
import { getIsPopup } from '~/modules/appState/selectors'
import { dismissLoader } from '~/modules/loader/actions'
import { ScreenNames } from '~/types/screens'
import DeviceAuthentication from '../Modals/DeviceAuthentication'
import Lock from '../Modals/Lock'
import Recovery from '../Modals/Recovery'
import PinRecoveryInstructions from '../Modals/PinRecoveryInstructions'
import Main from './Main'
import { useInitializeCredentials } from '~/hooks/signedCredentials'
import ScreenContainer from '~/components/ScreenContainer'
import { useRedirect } from '~/hooks/navigation'

export type LoggedInStackParamList = {
  Idle: undefined
  [ScreenNames.PasscodeRecovery]: {
    isAccessRestore: boolean
  }
  [ScreenNames.Main]: undefined
  [ScreenNames.Lock]: undefined
  [ScreenNames.PinRecoveryInstructions]: undefined
  [ScreenNames.DeviceAuth]: undefined
}

const LoggedInStack = createStackNavigator<LoggedInStackParamList>()

const screenTransitionOptions = {
  ...TransitionPresets.ModalSlideFromBottomIOS,
}

const Idle = () => <ScreenContainer />

const LoggedIn = () => {
  const dispatch = useDispatch()
  const isAuthSet = useSelector(isLocalAuthSet)
  const isAppLocked = useSelector(getIsAppLocked)
  const redirect = useRedirect()

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

  useEffect(() => {
    if (showLock) redirect(ScreenNames.Lock)
  }, [showLock])

  useEffect(() => {
    //NOTE: navigating imperatively b/c the Idle screen is rendered before Main
    if (showTabs) redirect(ScreenNames.Main)
  }, [showTabs])

  return (
    <LoggedInStack.Navigator headerMode="none">
      {showRegisterPin ? (
        <LoggedInStack.Screen
          name={ScreenNames.DeviceAuth}
          component={DeviceAuthentication}
          options={{
            ...screenTransitionOptions,
            gestureEnabled: false,
          }}
        />
      ) : (
        <>
          <LoggedInStack.Screen
            name={'Idle'}
            component={Idle}
            options={{
              ...screenTransitionOptions,
              gestureEnabled: false,
            }}
          />
          <LoggedInStack.Screen
            name={ScreenNames.Main}
            component={Main}
            options={{
              ...screenTransitionOptions,
              gestureEnabled: false,
            }}
          />
        </>
      )}
      {!showTabs && (
        <LoggedInStack.Screen
          name={ScreenNames.Lock}
          component={Lock}
          options={{
            ...screenTransitionOptions,
            gestureEnabled: false,
          }}
        />
      )}
      <LoggedInStack.Screen
        name={ScreenNames.PinRecoveryInstructions}
        component={PinRecoveryInstructions}
        options={{ ...screenTransitionOptions, gestureEnabled: false }}
      />
      <LoggedInStack.Screen
        name={ScreenNames.PasscodeRecovery}
        component={Recovery}
        options={{ ...screenTransitionOptions, gestureEnabled: false }}
      />
      {/* Modals -> End */}
    </LoggedInStack.Navigator>
  )
}

export default LoggedIn
