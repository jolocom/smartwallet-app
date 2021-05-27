import React, { useMemo, useRef } from 'react'
import RN, { NativeSyntheticEvent, TargetedEvent } from 'react-native'
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view'
import InputContainer from './InputContainer'
import { IJoloKeyboardAwareScrollComposition } from './types'
import { JoloKeyboardAwareScrollContext } from './context'

const JoloKeyboardAwareScroll: React.FC<KeyboardAwareScrollViewProps> &
  IJoloKeyboardAwareScrollComposition = ({ children, ...rest }) => {
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null)

  const handleFocusInput = (event: NativeSyntheticEvent<TargetedEvent>) => {
    const node = RN.findNodeHandle(event.target)
    node && scrollViewRef.current?.scrollToFocusedInput(node)
  }

  const contextValue = useMemo(
    () => ({
      onFocusInput: handleFocusInput,
    }),
    [handleFocusInput],
  )

  return (
    <JoloKeyboardAwareScrollContext.Provider value={contextValue}>
      <KeyboardAwareScrollView
        {...rest}
        ref={scrollViewRef}
        extraScrollHeight={50}
        contentInset={undefined}
        keyboardOpeningTime={0}
        children={children}
      />
    </JoloKeyboardAwareScrollContext.Provider>
  )
}

JoloKeyboardAwareScroll.InputContainer = InputContainer

export default JoloKeyboardAwareScroll
