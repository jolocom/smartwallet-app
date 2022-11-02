import { useNetInfo } from '@react-native-community/netinfo'
import { useEffect, useState } from 'react'

import { usePrevious } from './generic'
import { useToasts } from './toasts'
import useTranslation from './useTranslation'

const useConnection = () => {
  const { t } = useTranslation()
  const { scheduleWarning, scheduleSuccess } = useToasts()
  const netInfo = useNetInfo()

  const [connected, setConnected] = useState(true)

  useEffect(() => {
    setConnected(netInfo.isConnected === null ? true : netInfo.isConnected)
  }, [netInfo.isConnected])

  const showDisconnectedToast = () => {
    scheduleWarning({
      title: t('Toasts.noInternetTitle'),
      message: t('Toasts.noInternetMsg'),
    })
  }

  const showConnectedToast = () => {
    scheduleSuccess({
      title: t('Toasts.reconnectedInternetTitle'),
      message: t('Toasts.reconnectedInternetMsg'),
    })
  }

  return {
    connected,
    showDisconnectedToast,
    showConnectedToast,
  }
}

export const useAssertConnection = () => {
  const { connected, showDisconnectedToast } = useConnection()
  const prevConnected = usePrevious(connected)

  useEffect(() => {
    if (prevConnected === null && connected === false) {
      showDisconnectedToast()
    }
  }, [connected])
}

export default useConnection
