import React from 'react'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { useToastToShow } from './context'

const ToastDescription = ({ customStyles = {} }) => {
  const { toastToShow } = useToastToShow()
  if (!toastToShow || !toastToShow.message) return null
  return (
    <JoloText
      kind={JoloTextKind.subtitle}
      size={JoloTextSizes.tiniest}
      color={Colors.white}
      customStyles={[
        { lineHeight: BP({ xsmall: 14, default: 18 }) },
        customStyles,
      ]}
    >
      {toastToShow.message}
    </JoloText>
  )
}

export default ToastDescription
