import React from 'react'
import { TouchableOpacity } from 'react-native'

import { useToastToShow } from './context'
import ToastDescription from './ToastDescription'
import ToastTitle from './ToastTitle'

const StickyToast = () => {
  const { toastToShow, invokeInteract } = useToastToShow()
  if (toastToShow && !toastToShow?.dismiss) {
    return (
      <TouchableOpacity onPressIn={invokeInteract}>
        <ToastTitle />
        <ToastDescription />
      </TouchableOpacity>
    )
  }
  return null
}

export default StickyToast
