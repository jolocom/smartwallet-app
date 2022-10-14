import React from 'react'

import { useToastToShow } from './context'
import ToastContainer from './ToastContainer'
import ToastDescription from './ToastDescription'
import ToastTitle from './ToastTitle'

const InteractiveToast = () => {
  const { toastToShow, isInteractive } = useToastToShow()

  if (isInteractive) {
    return (
      <ToastContainer>
        <ToastTitle />
        <ToastDescription
          customStyles={{ flex: 1 }}
          label={toastToShow?.interact?.label}
        />
      </ToastContainer>
    )
  }
  return null
}

export default InteractiveToast
