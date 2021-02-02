import { useRef, useEffect } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { useSelector } from 'react-redux'
import { useAppState as useAppStateComm } from '@react-native-community/hooks'

import { isLocalAuthSet } from '~/modules/account/selectors'

export const useAppState = (
  callback: (state: AppStateStatus, nextState: AppStateStatus) => void,
) => {
  const appState = useRef(AppState.currentState)
  const isAuthSet = useSelector(isLocalAuthSet)

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    callback(appState.current, nextAppState)
    appState.current = nextAppState
  }

  /* because hooks are closures we need to pass new value of isAuthSet when it has been changed,
  otherwise isAuthSet will be false and lock would not appear */
  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)
    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [isAuthSet])
}

export const useAppStateNew = () => {
  const prevAppState = useRef<AppStateStatus | undefined>(undefined)
  const currentAppState = useAppStateComm();

  useEffect(() => {
    prevAppState.current = currentAppState;
  })

  return {
    currentAppState,
    prevAppState: prevAppState.current
  }
} 
