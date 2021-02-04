import React, { RefObject } from 'react'
import { StatusBar } from 'react-native'
import { useSelector } from 'react-redux'

import Loader from '~/modals/Loader'
import Toasts from './components/Toasts'
import { getIsAppLocked } from './modules/account/selectors'
import TermsConsent from './screens/Modals/TermsConsent'
import { NavigationContextProvider } from './NavigationProvider'
import { NavigationContainerRef } from '@react-navigation/native'

interface Props {
  navRef: RefObject<NavigationContainerRef>
}

const Overlays: React.FC<Props> = ({ navRef }) => {
  const isAppLocked = useSelector(getIsAppLocked)

  return (
    <NavigationContextProvider navRef={navRef}>
      <StatusBar
        backgroundColor={'transparent'}
        animated
        translucent
        barStyle="light-content"
      />
      <Toasts />
      <Loader />
      {!isAppLocked && <TermsConsent />}
    </NavigationContextProvider>
  )
}

export default Overlays
