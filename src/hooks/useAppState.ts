import { useRef, useEffect } from 'react'
import { AppStateStatus, Platform } from 'react-native'
import { useAppState } from '@react-native-community/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { getIsPopup } from '~/modules/appState/selectors'
import { setPopup } from '~/modules/appState/actions'

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

export const useAppBackgroundChange = (handler: () => void) => {
  const { currentAppState, prevAppState } = useGetAppStates()
  const isPopup = useSelector(getIsPopup)
  const dispatch = useDispatch()

  const backgroundTimer = useRef<number>()

  const goingToBackground =
    prevAppState &&
    prevAppState.match(/active/) &&
    currentAppState.match(/inactive|background/)

  const comingFromBackground =
    prevAppState &&
    prevAppState.match(/inactive|background/) &&
    currentAppState.match(/active/)

  useEffect(() => {
    if (goingToBackground) {
      backgroundTimer.current = new Date().getTime()
    }
  }, [currentAppState])

  // NOTE: Checks if the duration of state change was long enough. Mostly useful when
  // interacting with NFC, which causes very quick state changes, causing the Lock to
  // appear
  const shouldIgnoreStateChange = () => {
    const foregroundTimer = new Date().getTime()
    if (backgroundTimer.current && !isNaN(backgroundTimer.current)) {
      if (foregroundTimer - backgroundTimer.current < 1000) {
        backgroundTimer.current = undefined
        return true
      }

      backgroundTimer.current = undefined
      return false
    }
  }

  useEffect(() => {
    if (
      Platform.select({
        android: comingFromBackground,
        ios: goingToBackground,
      })
    ) {
      const ignoreStateChange =
        Platform.OS === 'android' && shouldIgnoreStateChange()

      if (!isPopup && !ignoreStateChange) {
        handler()
      } else {
        dispatch(setPopup(false))
      }
    }
  }, [currentAppState, isPopup])
}
