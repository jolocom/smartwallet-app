import { useRef, useState, useEffect } from 'react'
import { TextInput, Keyboard } from 'react-native'

const useFooter = () => {
  const inputRef = useRef<TextInput>(null)
  const [areBtnsVisible, setBtnsVisible] = useState(true)

  const showBtns = () => {
    setBtnsVisible(true)
    if (inputRef.current) {
      inputRef.current.blur()
    }
  }

  const hideBtns = () => {
    setBtnsVisible(false)
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', showBtns)
    return () => {
      Keyboard.removeListener('keyboardDidHide', showBtns)
    }
  }, [])

  return {
    inputRef,
    areBtnsVisible,
    hideBtns,
  }
}

export default useFooter
