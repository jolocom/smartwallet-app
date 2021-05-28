import React from 'react'
import { NativeSyntheticEvent, TargetedEvent } from 'react-native'
import { KeyboardAwareScrollViewProps } from 'react-native-keyboard-aware-scroll-view'

export type IJoloKeyboardAwareScrollProps = KeyboardAwareScrollViewProps & {
  disableInsets?: boolean
}

export interface IJoloKeyboardAwareScrollContext {
  onFocusInput: (event: NativeSyntheticEvent<TargetedEvent>) => void
}

export interface IJoloKeyboardAwareScrollComposition {
  InputContainer: React.FC<{
    children: (_: { focusInput: () => void }) => JSX.Element
  }>
}
