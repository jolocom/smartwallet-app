import { useNetInfo } from '@react-native-community/netinfo'
import { useEffect } from 'react'

import { usePrevious } from './generic'
import { useToasts } from './toasts'
import useTranslation from './useTranslation'

const useConnection = () => {
  const { t } = useTranslation()
  const { scheduleWarning, scheduleInfo } = useToasts()
  const netInfo = useNetInfo()

  const showDisconnectedToast = () => {
    scheduleWarning({
      title: t('Toasts.noInternetTitle'),
      message: t('Toasts.noInternetMsg'),
    })
  }

  const showConnectedToast = () => {
    scheduleInfo({
      title: t('Toasts.reconnectedInternetTitle'),
      message: t('Toasts.reconnectedInternetMsg'),
    })
  }

  return {
    connected: netInfo.isConnected,
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
