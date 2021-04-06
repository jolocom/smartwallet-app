import React, { RefObject, useEffect } from 'react'
import { StatusBar } from 'react-native'

import Loader from '~/modals/Loader'
import Toasts from './components/Toasts'
import { NavigationContextProvider } from './NavigationProvider'
import { NavigationContainerRef } from '@react-navigation/native'
import { useNetInfo } from '@react-native-community/netinfo'
import { useToasts } from './hooks/toasts'
import { strings } from './translations'
import { ToastType } from './types/toasts'

interface Props {
  navRef: RefObject<NavigationContainerRef>
}

const NO_CONNECTION_TOAST = {
  title: strings.NOT_CONNECTED,
  message: strings.WE_CANT_REACH_YOU,
}

const Overlays: React.FC<Props> = ({ navRef }) => {
  const netInfo = useNetInfo()
  const { activeToast, scheduleSticky, removeToast } = useToasts()

  useEffect(() => {
    if (!netInfo.isConnected) {
      scheduleSticky({
        ...NO_CONNECTION_TOAST,
        interact: {
          label: '',
          onInteract: () => true,
        },
      })
    } else {
      if (activeToast?.title === strings.NOT_CONNECTED) {
        removeToast({
          id: activeToast.id,
          type: ToastType.warning,
          ...NO_CONNECTION_TOAST,
        })
      }
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
