import { createStackNavigator } from '@react-navigation/stack'
import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// @ts-expect-error
import { enabled as enablePrivacyOverlay } from 'react-native-privacy-snapshot'

import { useAppBackgroundChange } from '~/hooks/useAppState'
import { setAppLocked } from '~/modules/account/actions'
import { getIsAppLocked, isLocalAuthSet } from '~/modules/account/selectors'
import { dismissLoader } from '~/modules/loader/actions'
import { ScreenNames } from '~/types/screens'
import DeviceAuthentication from '../Modals/DeviceAuthentication'
import Main from './Main'
import ScreenContainer from '~/components/ScreenContainer'
import { useRedirect, useReplaceWith } from '~/hooks/navigation'
import LockStack from './LockStack'
import { screenTransitionFromBottomDisabledGestures } from '~/utils/screenSettings'
import { Platform } from 'react-native'
import { useAgent } from '~/hooks/sdk'
import { ScreenshotManager } from '~/utils/screenshots'
import { useAusweisReaderEvents } from './eID/hooks'

export type LoggedInStackParamList = {
  Idle: undefined
  [ScreenNames.Main]: undefined
  [ScreenNames.LockStack]: undefined
  [ScreenNames.DeviceAuth]: undefined
}

const LoggedInStack = createStackNavigator<LoggedInStackParamList>()

const Idle = () => <ScreenContainer />

const LoggedIn = () => {
  const dispatch = useDispatch()
  const isAuthSet = useSelector(isLocalAuthSet)
  const isAppLocked = useSelector(getIsAppLocked)
  const redirect = useRedirect()
  const replace = useReplaceWith()
  const agent = useAgent()

  const showLock = isAppLocked && isAuthSet
  const showRegisterPin = !isAuthSet
  const showTabs = !isAppLocked && isAuthSet

  const renderedMainTimes = useRef(0)

  useEffect(() => {
    // NOTE: Setting the secure flag if screenshots are disabled in settings
    if (Platform.OS === 'android') {
      ScreenshotManager.getDisabledStatus(agent).then((isDisabled) => {
        isDisabled ? ScreenshotManager.disable() : ScreenshotManager.enable()
      })
    }
  }, [])

  useAusweisReaderEvents()

  const dismissOverlays = useCallback(() => {
    dispatch(dismissLoader())
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
          name={ScreenNames.DeviceAuth}
          component={DeviceAuthentication}
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
