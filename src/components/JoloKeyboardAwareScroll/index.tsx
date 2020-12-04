import React, { createContext, useMemo, useRef } from 'react'
import RN, {
  KeyboardAvoidingViewProps,
  NativeSyntheticEvent,
  ScrollViewProps,
  TargetedEvent,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useCustomContext } from '~/hooks/context'

interface IContext {
  onFocusInput: (event: NativeSyntheticEvent<TargetedEvent>) => void
}

const JoloKeyboardAwareScrollContext = createContext<IContext>({
  onFocusInput: () => {},
})
JoloKeyboardAwareScrollContext.displayName = 'JoloKeyboardAwareScrollContext'

export const useJoloAwareScroll = useCustomContext(
  JoloKeyboardAwareScrollContext,
)

const JoloKeyboardAwareScroll: React.FC<
  KeyboardAvoidingViewProps & ScrollViewProps
> = ({ children, ...rest }) => {
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null)

  const handleFocusInput = (event: NativeSyntheticEvent<TargetedEvent>) => {
    scrollViewRef.current?.scrollToFocusedInput(RN.findNodeHandle(event.target))
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
        children={children}
      />
    </JoloKeyboardAwareScrollContext.Provider>
  )
}

export default JoloKeyboardAwareScroll
