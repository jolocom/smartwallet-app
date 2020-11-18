import React from 'react'
import { TouchableOpacity } from 'react-native'

import { useToastToShow } from './context'
import ToastContainer from './ToastContainer'
import ToastDescription from './ToastDescription'
import ToastTitle from './ToastTitle'

const StickyToast = () => {
  const { invokeInteract, isSticky } = useToastToShow()
  if (isSticky) {
    return (
      <TouchableOpacity onPressIn={invokeInteract}>
        <ToastContainer>
          <ToastTitle />
          <ToastDescription />
        </ToastContainer>
      </TouchableOpacity>
    )
  }
  return null
}

export default StickyToast
