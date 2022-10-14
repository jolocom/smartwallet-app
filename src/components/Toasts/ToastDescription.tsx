import React from 'react'

import { useToastToShow } from './context'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { IWithCustomStyle } from '~/types/props'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

interface Props extends IWithCustomStyle {
  label?: string
}

const ToastDescription: React.FC<Props> = ({ label, customStyles = {} }) => {
  const { toastToShow, toastColor, invokeInteract } = useToastToShow()

  const renderLabel = () => (
    <JoloText
      kind={JoloTextKind.subtitle}
      size={JoloTextSizes.tiniest}
      color={toastColor}
      customStyles={{
        textAlign: 'left',
        lineHeight: BP({ xsmall: 14, default: 18 }),
        textDecorationLine: 'underline',
      }}
      onPress={invokeInteract}
    >
      {label}
    </JoloText>
  )

  if (!toastToShow || !toastToShow.message) return null

  return (
    <JoloText
      kind={JoloTextKind.subtitle}
      size={JoloTextSizes.tiniest}
      color={Colors.white}
      customStyles={[
        { textAlign: 'left', lineHeight: BP({ xsmall: 14, default: 18 }) },
        customStyles,
      ]}
    >
      {toastToShow.message} {label && renderLabel()}
    </JoloText>
  )
}

export default ToastDescription
