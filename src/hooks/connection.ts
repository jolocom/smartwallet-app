import { useNetInfo } from '@react-native-community/netinfo'
import { useEffect } from 'react'

import { strings } from '~/translations'
import { usePrevious } from './generic'
import { useToasts } from './toasts'

const DISCONNECTED_TOAST = {
  title: strings.NOT_CONNECTED,
  message: strings.WE_CANT_REACH_YOU,
}

const CONNECTED_TOAST = {
  title: strings.YOU_ARE_BACK_ONLINE,
  message: strings.ALL_WALLET_FUNCTIONALITIES,
}

const useConnection = () => {
  const { scheduleWarning, scheduleInfo } = useToasts()
  const netInfo = useNetInfo()

  const showDisconnectedToast = () => {
    scheduleWarning({
      ...DISCONNECTED_TOAST,
    })
  }

  const showConnectedToast = () => {
    scheduleInfo({
      ...CONNECTED_TOAST,
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
