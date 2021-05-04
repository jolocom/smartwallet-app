import { useNetInfo } from '@react-native-community/netinfo'

import { strings } from '~/translations'
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
  const connected = netInfo.isConnected

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

  const assertConnection = () => {
    if (!connected) showDisconnectedToast()
  }

  return {
    connected,
    showDisconnectedToast,
    showConnectedToast,
    assertConnection,
  }
}

export default useConnection
