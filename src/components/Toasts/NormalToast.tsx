import React from 'react'
import { useToastToShow } from './context'
import ToastDescription from './ToastDescription'
import ToastTitle from './ToastTitle'

const NormalToast = () => {
  const { toastToShow } = useToastToShow()

  if (toastToShow && toastToShow.dismiss && !toastToShow?.interact) {
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
