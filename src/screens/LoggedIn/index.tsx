import { createStackNavigator } from '@react-navigation/stack'
import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useGetAppStates } from '~/hooks/useAppState'
import { setAppLocked } from '~/modules/account/actions'
import { getIsAppLocked, isLocalAuthSet } from '~/modules/account/selectors'
import { setPopup } from '~/modules/appState/actions'
import { getIsPopup } from '~/modules/appState/selectors'
import { dismissLoader } from '~/modules/loader/actions'
import { ScreenNames } from '~/types/screens'
import WalletAuthentication from '../Modals/WalletAuthentication'
import Main from './Main'
import ScreenContainer from '~/components/ScreenContainer'
import { useRedirect, useReplaceWith } from '~/hooks/navigation'
import LockStack from './LockStack'
import { screenTransitionFromBottomDisabledGestures } from '~/utils/screenSettings'

export type LoggedInStackParamList = {
  Idle: undefined
  [ScreenNames.Main]: undefined
  [ScreenNames.LockStack]: undefined
  [ScreenNames.WalletAuthentication]: undefined
}

const LoggedInStack = createStackNavigator<LoggedInStackParamList>()

const Idle = () => <ScreenContainer />

const LoggedIn = () => {
  const dispatch = useDispatch()
  const isAuthSet = useSelector(isLocalAuthSet)
  const isAppLocked = useSelector(getIsAppLocked)
  const redirect = useRedirect()
  const replace = useReplaceWith()

  const showLock = isAppLocked && isAuthSet
  const showRegisterPin = !isAuthSet
  const showTabs = !isAppLocked && isAuthSet

  const renderedMainTimes = useRef(0)

  const dismissOverlays = useCallback(() => {
    dispatch(dismissLoader())
  }, [])

  /* All about when lock screen comes up - START */
  const isPopup =
    useSelector(
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
    if (showLock) redirect(ScreenNames.LockStack)
  }, [showLock])

  useEffect(() => {
    //NOTE: navigating imperatively b/c the Idle screen is rendered before Main
    if (showTabs && !renderedMainTimes.current) {
      renderedMainTimes.current++
      replace(ScreenNames.Main)
    }
  }, [showTabs])

  return (
    <LoggedInStack.Navigator headerMode="none">
      {showRegisterPin ? (
        <LoggedInStack.Screen
          name={ScreenNames.WalletAuthentication}
          component={WalletAuthentication}
          options={screenTransitionFromBottomDisabledGestures}
        />
      ) : (
        <>
          <LoggedInStack.Screen
            name={'Idle'}
            component={Idle}
            options={screenTransitionFromBottomDisabledGestures}
          />
          <LoggedInStack.Screen
            name={ScreenNames.Main}
            component={Main}
            options={screenTransitionFromBottomDisabledGestures}
          />
          {!showTabs && (
            <LoggedInStack.Screen
              name={ScreenNames.LockStack}
              component={LockStack}
              options={screenTransitionFromBottomDisabledGestures}
            />
          )}
        </>
      )}
      {/* Modals -> End */}
    </LoggedInStack.Navigator>
  )
}

export default LoggedIn
