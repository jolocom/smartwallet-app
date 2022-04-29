import { useRef, useEffect } from 'react'
import { AppStateStatus, Platform } from 'react-native'
import { useAppState } from '@react-native-community/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { getIsPopup } from '~/modules/appState/selectors'
import { setPopup } from '~/modules/appState/actions'
import { IS_ANDROID } from '~/utils/generic'

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
    prevAppState.match(
      Platform.select({ ios: 'inactive', android: 'active' }),
    ) &&
    currentAppState.match(/background/)

  const comingFromBackground =
    prevAppState &&
    prevAppState.match(/background/) &&
    currentAppState.match(/active/)

  /**
   * Every time the app goes to the background
   * start counter how much time the app stayed in the
   * background
   */
  useEffect(() => {
    if (goingToBackground) {
      backgroundTimer.current = new Date().getTime()
    }
  }, [currentAppState])

  // NOTE: Checks if the duration of state change was long enough. Mostly useful when
  // interacting with NFC, which causes very quick state changes, causing the Lock to
  // appear
  const shouldIgnoreStateChange = (allowedTime: number) => {
    const foregroundTimer = new Date().getTime()
    if (backgroundTimer.current && !isNaN(backgroundTimer.current)) {
      if (foregroundTimer - backgroundTimer.current < allowedTime) {
        backgroundTimer.current = undefined
        return true
      }

      backgroundTimer.current = undefined
      return false
    }
  }

  /**
   * NOTE:
   * whenever app comes from the background to foreground
   * enable the Lock for both OSes
   */
  useEffect(() => {
    if (comingFromBackground) {
      dispatch(setPopup(false))
    }
  }, [currentAppState])

  /**
   * Run handler (i.e. lock the app) if the app
   * - goes to background on iOS
   * - goes from background on Android
   */
  useEffect(() => {
    if (
      Platform.select({
        android: comingFromBackground,
        ios: goingToBackground,
      })
    ) {
      const ignoreStateChange = IS_ANDROID && shouldIgnoreStateChange(1000)
      if (!ignoreStateChange && !isPopup) handler()
    }
  }, [currentAppState, isPopup])
}
