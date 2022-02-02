import React, { RefObject, useEffect } from 'react'
import { StatusBar } from 'react-native'

import Loader from '~/modals/Loader'
import Toasts from './components/Toasts'
import { NavigationContextProvider } from './NavigationProvider'
import { NavigationContainerRef } from '@react-navigation/native'
import { usePrevious } from './hooks/generic'
import useConnection from './hooks/connection'
import TermsConsent from './screens/Modals/TermsConsent'

interface Props {
  navRef: RefObject<NavigationContainerRef>
}

const Overlays: React.FC<Props> = ({ navRef }) => {
  const { connected, showConnectedToast, showDisconnectedToast } =
    useConnection()
  const prevConnected = usePrevious(connected)

  useEffect(() => {
    if (connected === false) {
      showDisconnectedToast()
    }
    if (prevConnected === false && connected === true) {
      showConnectedToast()
    }
  }, [connected])

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
      <TermsConsent />
    </NavigationContextProvider>
  )
}

export default Overlays
