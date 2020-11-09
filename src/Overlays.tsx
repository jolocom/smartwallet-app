import React from 'react'
import { StatusBar } from 'react-native'
import { useSelector } from 'react-redux'

import Loader from '~/modals/Loader'
import ActionSheetManager from './components/ActionSheet/ActionSheetManager'
import Toasts from './components/Toasts'
import { getInteractionType } from './modules/interaction/selectors'
import { getIsAppLocked } from './modules/account/selectors'
import TermsConsent from './screens/Modals/TermsConsent'

const Overlays = () => {
  const isInteracting = useSelector(getInteractionType)
  const isAppLocked = useSelector(getIsAppLocked)

  return (
    <>
      <StatusBar
        backgroundColor={'transparent'}
        animated
        translucent
        barStyle="light-content"
      />
      <Loader />
      <Toasts />
      {!isAppLocked && <TermsConsent />}
      {isInteracting && <ActionSheetManager />}
    </>
  )
}

export default Overlays
