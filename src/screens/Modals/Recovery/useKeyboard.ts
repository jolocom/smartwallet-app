import { useState, useEffect } from 'react'
import { Keyboard, KeyboardEventListener } from 'react-native'
import { useRecoveryDispatch } from './module/recoveryContext'
import { hideSuggestions, showSuggestions } from './module/recoveryActions'
import { useSelector } from 'react-redux'
import { getScreenHeight } from '~/modules/account/selectors'

export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const screenHeight = useSelector(getScreenHeight);
  
  const recoveryDispatch = useRecoveryDispatch()
  
  const handleKeyboardShow: KeyboardEventListener = (e) => {
    setKeyboardHeight(screenHeight - e.endCoordinates.screenY)
    recoveryDispatch(showSuggestions())
  }

  const handleKeyboardHide = () => {
    setKeyboardHeight(0)
    recoveryDispatch(hideSuggestions())
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
