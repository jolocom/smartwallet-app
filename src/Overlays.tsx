import React from 'react'
import { StatusBar } from 'react-native'
import { useSelector } from 'react-redux'

import Loader from '~/modals/Loader'
import ActionSheetManager from './components/ActionSheet/ActionSheetManager'
import Notifications from './components/Notifications'
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
      <Notifications />
      {!isAppLocked && <TermsConsent />}
      {isInteracting && <ActionSheetManager />}
    </>
  )
}

export default Overlays
