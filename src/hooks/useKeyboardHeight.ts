import { useEffect, useRef, useState } from "react"
import { Keyboard, KeyboardEvent } from "react-native";

export const useKeyboardHeight = (initialValue: number) => {
  const [keyboardHeight, setKeyboardHeight] = useState(initialValue)

    const handleKeyboard = (e: KeyboardEvent) => {
      setKeyboardHeight(e.startCoordinates ? 
       (e.endCoordinates.height + e.startCoordinates.height) / 2 : e.endCoordinates.height);
   }

    useEffect(() => {
     Keyboard.addListener('keyboardDidShow', handleKeyboard)
     ;() => {
       Keyboard.removeListener('keyboardDidShow', handleKeyboard)
     }
   }, [])

   return {keyboardHeight}
}