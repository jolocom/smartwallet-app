import React, { useMemo, useRef } from 'react'
import RN, { NativeSyntheticEvent, Platform, TargetedEvent } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import InputContainer from './InputContainer'
import {
  IJoloKeyboardAwareScrollComposition,
  IJoloKeyboardAwareScrollProps,
} from './types'
import { JoloKeyboardAwareScrollContext } from './context'

const JoloKeyboardAwareScroll: React.FC<IJoloKeyboardAwareScrollProps> &
  IJoloKeyboardAwareScrollComposition = ({
  children,
  disableInsets = false,
  ...rest
}) => {
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
        ref={scrollViewRef}
        extraScrollHeight={Platform.select({ ios: 50, android: 150 })}
        keyboardOpeningTime={0}
        children={children}
        {...(disableInsets && { contentInset: undefined })}
        {...rest}
      />
    </JoloKeyboardAwareScrollContext.Provider>
  )
}

JoloKeyboardAwareScroll.InputContainer = InputContainer

export default JoloKeyboardAwareScroll
