import React, { RefObject } from 'react'
import { StatusBar } from 'react-native'
import { useSelector } from 'react-redux'

import Loader from '~/modals/Loader'
import ActionSheetManager from './components/ActionSheet/ActionSheetManager'
import Toasts from './components/Toasts'
import { getInteractionType } from './modules/interaction/selectors'
import { getIsAppLocked } from './modules/account/selectors'
import TermsConsent from './screens/Modals/TermsConsent'
import { NavigationContextProvider } from './NavigationProvider'
import { NavigationContainerRef } from '@react-navigation/native'

interface Props {
  navRef: RefObject<NavigationContainerRef>
}

const Overlays: React.FC<Props> = ({ navRef }) => {
  const isInteracting = useSelector(getInteractionType)
  const isAppLocked = useSelector(getIsAppLocked)

  return (
    <NavigationContextProvider navRef={navRef}>
      <StatusBar
        backgroundColor={'transparent'}
        animated
        translucent
        barStyle="light-content"
      />
      {isInteracting && <ActionSheetManager />}
      <Loader />
      <Toasts />
      {!isAppLocked && <TermsConsent />}
    </NavigationContextProvider>
  )
}

export default Overlays
