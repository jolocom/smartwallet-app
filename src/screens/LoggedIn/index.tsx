import { createStackNavigator } from '@react-navigation/stack'
import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setAppLocked,
  setTermsConsentVisibility,
} from '~/modules/account/actions'
import {
  getIsAppLocked,
  isLocalAuthSet,
  getIsTermsConsentOutdated,
} from '~/modules/account/selectors'
import { getIsPopup } from '~/modules/appState/selectors'
// @ts-expect-error
import { enabled as enablePrivacyOverlay } from 'react-native-privacy-snapshot'

import { useAppBackgroundChange } from '~/hooks/useAppState'
import { dismissLoader } from '~/modules/loader/actions'
import { ScreenNames } from '~/types/screens'
import WalletAuthentication from '../Modals/WalletAuthentication'
import Main from './Main'
import ScreenContainer from '~/components/ScreenContainer'
import { useRedirect, useReplaceWith } from '~/hooks/navigation'
import LockStack from './LockStack'
import { screenTransitionFromBottomDisabledGestures } from '~/utils/screenSettings'
import eIDHooks from '~/screens/Modals/Interaction/eID/hooks'

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

  // NOTE: Used to listen for Ausweis READER messages and update the Redux state
  eIDHooks.useAusweisReaderEvents()
  eIDHooks.useObserveAusweisFlow()

  const dismissOverlays = useCallback(() => {
    dispatch(dismissLoader())
  }, [])

  /* All about when lock screen comes up - START */
  const isPopup =
    useSelector(
      getIsPopup,
    ) /* isPopup is used as a workaround for Android app state change */

  const isPopupRef = useRef<boolean>(isPopup)

  const isTermsConsentOutdated = useSelector(getIsTermsConsentOutdated)
  useEffect(() => {
    if (isTermsConsentOutdated) {
      dispatch(setTermsConsentVisibility(true))
    }
  }, [])

  useEffect(() => {
    enablePrivacyOverlay(true)
  }, [])

  useAppBackgroundChange(() => {
    if (isAuthSet) {
      dispatch(setAppLocked(true))
      dismissOverlays()
    }
  })

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
