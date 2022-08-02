import { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// @ts-expect-error
import { enabled as enablePrivacyOverlay } from 'react-native-privacy-snapshot'

import { setAppLocked } from '~/modules/account/actions'
import {
  getIsAppLocked,
  getIsTermsConsentOutdated,
  isLocalAuthSet,
} from '~/modules/account/selectors'
import { dismissLoader } from '~/modules/loader/actions'
import eIDHooks from '~/screens/Modals/Interaction/eID/hooks'
import { ScreenNames } from '~/types/screens'
import { useRedirect, useReplaceWith } from './navigation'
import { useAppBackgroundChange } from './useAppState'

export const useInitApp = () => {
  const lockState = useInitLock()

  useInitAusweis()
  useInitTerms()

  useEffect(() => {
    // @ts-ignore no types for now
    enablePrivacyOverlay(true)
  }, [])

  return { ...lockState }
}

const useInitAusweis = () => {
  // NOTE: Used to listen for Ausweis READER messages and update the Redux state
  eIDHooks.useAusweisReaderEvents()
  eIDHooks.useObserveAusweisFlow()
}

const useInitLock = () => {
  const isAuthSet = useSelector(isLocalAuthSet)
  const isAppLocked = useSelector(getIsAppLocked)
  const replace = useReplaceWith()
  const redirect = useRedirect()
  const dispatch = useDispatch()

  const renderedMainTimes = useRef(0)

  const showContent = !isAppLocked && isAuthSet
  const showLock = isAppLocked && isAuthSet
  const showLockRegister = !isAuthSet

  const dismissOverlays = useCallback(() => {
    dispatch(dismissLoader())
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
    if (showContent && !renderedMainTimes.current) {
      renderedMainTimes.current++
      replace(ScreenNames.Main)
    }
  }, [showContent])

  return {
    showContent,
    showLock,
    showLockRegister,
  }
}

const useInitTerms = () => {
  const isTermsConsentOutdated = useSelector(getIsTermsConsentOutdated)
  const isAppLocked = useSelector(getIsAppLocked)
  const redirect = useRedirect()

  useEffect(() => {
    if (isTermsConsentOutdated && !isAppLocked) {
      setTimeout(() => {
        redirect(ScreenNames.GlobalModals, { screen: ScreenNames.TermsConsent })
      }, 100)
    }
  }, [isTermsConsentOutdated, isAppLocked])
}
