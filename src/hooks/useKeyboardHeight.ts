import { useEffect, useRef, useState } from "react"
import { Keyboard, KeyboardEvent } from "react-native";

export const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

    const handleKeyboard = (e: KeyboardEvent) => {
      console.log({e});
      
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