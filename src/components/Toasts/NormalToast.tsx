import React from 'react'
import { useToastToShow } from './context'
import ToastDescription from './ToastDescription'
import ToastTitle from './ToastTitle'

const NormalToast = () => {
  const { isNormal } = useToastToShow()
  if (isNormal) {
    return (
      <>
        <ToastTitle />
        <ToastDescription />
      </>
    )
  }
  return null
}

export default NormalToast
