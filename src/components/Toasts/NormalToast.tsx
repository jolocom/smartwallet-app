import React from 'react'
import { useToastToShow } from './context'
import ToastContainer from './ToastContainer'
import ToastDescription from './ToastDescription'
import ToastTitle from './ToastTitle'

const NormalToast = () => {
  const { isNormal } = useToastToShow()
  if (isNormal) {
    return (
      <ToastContainer>
        <ToastTitle />
        <ToastDescription />
      </ToastContainer>
    )
  }
  return null
}

export default NormalToast
