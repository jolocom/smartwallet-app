import React, { RefObject, useEffect } from 'react'
import { StatusBar } from 'react-native'

import Loader from '~/modals/Loader'
import Toasts from './components/Toasts'
import { NavigationContextProvider } from './NavigationProvider'
import { NavigationContainerRef } from '@react-navigation/native'
import { useNetInfo } from '@react-native-community/netinfo'
import { useToasts } from './hooks/toasts'
import { strings } from './translations'
import { usePrevious } from './hooks/generic'

interface Props {
  navRef: RefObject<NavigationContainerRef>
}

const NO_CONNECTION_TOAST = {
  title: strings.NOT_CONNECTED,
  message: strings.WE_CANT_REACH_YOU,
}

const CONNECTION_TOAST = {
  title: strings.YOU_ARE_BACK_ONLINE,
  message: strings.ALL_WALLET_FUNCTIONALITIES,
}

const Overlays: React.FC<Props> = ({ navRef }) => {
  const netInfo = useNetInfo()
  const { scheduleWarning, scheduleInfo } = useToasts()
  const prevConnection = usePrevious(netInfo)

  useEffect(() => {
    if (netInfo.isConnected === false) {
      scheduleWarning({
        ...NO_CONNECTION_TOAST,
      })
    }
    if (prevConnection?.isConnected === false && netInfo.isConnected === true) {
      scheduleInfo({
        ...CONNECTION_TOAST,
      })
    }
  }, [netInfo.isConnected])

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
    </NavigationContextProvider>
  )
}

export default Overlays
