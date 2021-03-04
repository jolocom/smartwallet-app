import { createContext } from 'react'
import { useCustomContext } from '~/hooks/context'
import { IJoloKeyboardAwareScrollContext } from './types'

export const JoloKeyboardAwareScrollContext = createContext<
  IJoloKeyboardAwareScrollContext | undefined
>({
  onFocusInput: () => {},
})
JoloKeyboardAwareScrollContext.displayName = 'JoloKeyboardAwareScrollContext'

export const useJoloAwareScroll = useCustomContext(
  JoloKeyboardAwareScrollContext,
)
