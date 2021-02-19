import React from 'react'
import { useJoloAwareScroll } from './context'

const InputContainer: React.FC = ({ children }) => {
  const { onFocusInput } = useJoloAwareScroll()
  if (typeof children === 'function') {
    return children({ onFocus: onFocusInput })
  }
  return children
}

export default InputContainer
