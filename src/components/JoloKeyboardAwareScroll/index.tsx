import React, { createContext, useMemo, useRef } from 'react'
import RN, { NativeSyntheticEvent, TargetedEvent } from 'react-native'
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view'
import { useCustomContext } from '~/hooks/context'
import InputContainer from './InputContainer'

interface IContext {
  onFocusInput: (event: NativeSyntheticEvent<TargetedEvent>) => void
}

interface IJoloKeyboardAwareScrollComposition {
  InputContainer: React.FC<{
    children: (_: { focusInput: () => void }) => JSX.Element
  }>
}

const JoloKeyboardAwareScrollContext = createContext<IContext>({
  onFocusInput: () => {},
})
JoloKeyboardAwareScrollContext.displayName = 'JoloKeyboardAwareScrollContext'

export const useJoloAwareScroll = useCustomContext(
  JoloKeyboardAwareScrollContext,
)

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
        keyboardOpeningTime={0}
        children={children}
      />
    </JoloKeyboardAwareScrollContext.Provider>
  )
}

JoloKeyboardAwareScroll.InputContainer = InputContainer

export default JoloKeyboardAwareScroll
