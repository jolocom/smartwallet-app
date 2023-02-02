import { useNavigation } from '@react-navigation/native'
import { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// @ts-expect-error
import { enabled as enablePrivacyOverlay } from 'react-native-privacy-snapshot'

import { useInitDocuments } from '~/hooks/documents'
import { setAppLocked } from '~/modules/account/actions'
import {
  getIsAppLocked,
  getIsTermsConsentOutdated,
  isLocalAuthSet,
} from '~/modules/account/selectors'
import { setIsPersonalizingMdl } from '~/modules/interaction/mdl/actions'
import {
  getIsPersonalizingMdl,
  getMdoc,
} from '~/modules/interaction/mdl/selectors'
import { getInteractionType } from '~/modules/interaction/selectors'
import { dismissLoader } from '~/modules/loader/actions'
import { useDrivingLicense } from '~/screens/LoggedIn/Documents/DrivingLicenseDemo/hooks'
import eIDHooks from '~/screens/Modals/Interaction/eID/hooks'
import { ScreenNames } from '~/types/screens'
import { useRedirect, useReplaceWith } from './navigation'
import { useAppBackgroundChange } from './useAppState'

export const useInitApp = () => {
  const lockState = useInitLock()
  const { initialize: initDocuments } = useInitDocuments()
  const isInteracting = useSelector(getInteractionType)
  const isAppLocked = useSelector(getIsAppLocked)
  const navigation = useNavigation()

  useInitAusweis()
  useInitTerms()
  useInitMdl()

  useEffect(() => {
    // @ts-ignore no types for now
    enablePrivacyOverlay(true)

    initDocuments()
  }, [])

  useEffect(() => {
    if (!isAppLocked && isInteracting) {
      navigation.navigate(ScreenNames.Interaction)
    }
  }, [isAppLocked, isInteracting])

  return { ...lockState }
}

const useInitAusweis = () => {
  // NOTE: Used to listen for Ausweis READER messages and update the Redux state
  eIDHooks.useAusweisReaderEvents()
  eIDHooks.useObserveAusweisFlow()
}

const useInitMdl = () => {
  const isAppLocked = useSelector(getIsAppLocked)
  const mdlDoc = useSelector(getMdoc)
  const isPersonalizingMdl = useSelector(getIsPersonalizingMdl)
  const redirect = useRedirect()
  const { personalizeLicense } = useDrivingLicense()
  const dispatch = useDispatch()

  useEffect(() => {
    if (
      !isAppLocked &&
      !isPersonalizingMdl &&
      mdlDoc?.startsWith('iso23220-3-sed:')
    ) {
      dispatch(setIsPersonalizingMdl(true))
      personalizeLicense(mdlDoc, (requests) =>
        redirect(ScreenNames.DrivingLicenseForm, { requests }),
      )
    }
  }, [isAppLocked, mdlDoc, isPersonalizingMdl])
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
