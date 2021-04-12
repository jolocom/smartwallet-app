import React from 'react'
import { useCustomContext } from '~/hooks/context'
import { Toast } from '~/types/toasts'
import { Colors } from '~/utils/colors'

interface IToastContext {
  toastToShow: Toast | null | undefined
  toastColor: Colors
  invokeInteract: () => void
  isNormal: boolean
  isInteractive: boolean
  isSticky: boolean
}

export const ToastToShowContext = React.createContext<
  IToastContext | undefined
>({
  toastToShow: null,
  toastColor: Colors.white,
  invokeInteract: () => {},
  isNormal: false,
  isInteractive: false,
  isSticky: false,
})
ToastToShowContext.displayName = 'ToastToShowContext'

export const useToastToShow = useCustomContext(ToastToShowContext)
