import { useEffect, RefObject } from 'react'
import { TextInput } from 'react-native'

const useFocusInput = (
  inputRef: RefObject<TextInput>,
  currentWordIdx: number,
  phraseLength: number,
) => {
  useEffect(() => {
    if (!inputRef.current?.isFocused() && phraseLength > 0) {
      inputRef.current?.focus()
    }
  }, [currentWordIdx])
}

export default useFocusInput
