import React from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  TargetedEvent,
} from 'react-native'
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view'

export type IJoloKeyboardAwareScrollProps = KeyboardAwareScrollViewProps & {
  onScrollEndDrag: (
    event: NativeSyntheticEvent<NativeScrollEvent>,
    ref: React.RefObject<KeyboardAwareScrollView>,
  ) => void
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
