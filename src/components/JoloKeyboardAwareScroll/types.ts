import React from 'react'
import { NativeSyntheticEvent, TargetedEvent } from 'react-native'

export interface IJoloKeyboardAwareScrollContext {
  onFocusInput: (event: NativeSyntheticEvent<TargetedEvent>) => void
}

export interface IJoloKeyboardAwareScrollComposition {
  InputContainer: React.FC<{
    children: (_: { focusInput: () => void }) => JSX.Element
  }>
}
