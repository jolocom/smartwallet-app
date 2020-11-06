import React, { useContext } from 'react'
import { Toast } from '~/types/toasts'
import { Colors } from '~/utils/colors'

interface IToastContext {
  toastToShow: Toast | null
  toastColor: Colors
  invokeInteract: () => void
}

export const ToastToShowContext = React.createContext<IToastContext>({
  toastToShow: null,
  toastColor: Colors.white,
  invokeInteract: () => {},
})

export const useToastToShow = () => {
  const context = useContext(ToastToShowContext)
  if (!context)
    throw new Error(
      'This component should be used withing ActiveToast context provider',
    )
  return context
}
