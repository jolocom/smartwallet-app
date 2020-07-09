import { useState, useEffect } from 'react'
import { Keyboard, KeyboardEventListener } from 'react-native'
import { useRecoveryState, useRecoveryDispatch } from './module/recoveryContext'
import { hideSuggestions } from './module/recoveryActions'

export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  const { suggestedKeys } = useRecoveryState()
  const recoveryDispatch = useRecoveryDispatch()

  const handleKeyboardShow: KeyboardEventListener = (e) => {
    setKeyboardHeight(e.endCoordinates.height)
  }

  const handleKeyboardHide = () => {
    setKeyboardHeight(0)
    if (suggestedKeys.length) {
      recoveryDispatch(hideSuggestions())
    }
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', handleKeyboardShow)
    Keyboard.addListener('keyboardDidHide', handleKeyboardHide)
    return () => {
      Keyboard.removeListener('keyboardDidShow', handleKeyboardShow)
      Keyboard.removeListener('keyboardDidHide', handleKeyboardHide)
    }
  }, [])

  return { keyboardHeight }
}
