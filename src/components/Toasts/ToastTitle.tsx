import React from 'react'
import BP from '~/utils/breakpoints'
import { JoloTextSizes } from '~/utils/fonts'
import JoloText, { JoloTextKind } from '../JoloText'
import { useToastToShow } from './context'

const ToastTitle = ({ customStyles = {} }) => {
  const { toastToShow, toastColor } = useToastToShow()

  if (!toastToShow) return null
  return (
    <JoloText
      kind={JoloTextKind.title}
      size={JoloTextSizes.mini}
      color={toastColor}
      customStyles={{
        textAlign: 'left',
        letterSpacing: 0.09,
        lineHeight: BP({ xsmall: 14, default: 18 }),
        ...customStyles,
      }}
    >
      {toastToShow.title}
    </JoloText>
  )
}

export default ToastTitle
