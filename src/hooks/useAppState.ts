import { useRef, useEffect } from 'react'
import { AppStateStatus } from 'react-native'
import { useAppState } from '@react-native-community/hooks'

export const useGetAppStates = () => {
  const prevAppState = useRef<AppStateStatus | undefined>(undefined)
  const currentAppState = useAppState()

  useEffect(() => {
    prevAppState.current = currentAppState
  })

  return {
    currentAppState,
    prevAppState: prevAppState.current,
  }
}
